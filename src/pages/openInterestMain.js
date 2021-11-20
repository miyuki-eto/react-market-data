import React, {useEffect, useState} from 'react';
import axios from "axios";
import axiosThrottle from 'axios-request-throttle';

import CombinedOiView from "../components/views/combinedOiView";
import BinanceOiView from "../components/views/binanceOiView";
import FtxOiView from "../components/views/ftxOiView";
import {ThemeContext} from "../components/structure/themeContext";

axiosThrottle.use(axios, {requestsPerSecond: 9});

export default function OpenInterestMain() {
    const [binanceTokens, setBinanceTokens] = useState([]);
    const [binanceTokensCoin, setBinanceTokensCoin] = useState([]);
    const [ftxTokens, setFtxTokens] = useState([]);
    const [tokenDict, setTokenDict] = useState(() => {
        return JSON.parse(localStorage.getItem("tokenDict")) || {};
    });
    const [binanceOi, setBinanceOi] = useState([]);
    const [binanceOiCoin, setBinanceOiCoin] = useState([]);
    const [ftxOi, setFtxOi] = useState([]);

    const [binanceOiCombined, setBinanceOiCombined] = useState([]);
    const [ftxOiCombined, setFtxOiCombined] = useState([]);

    const [oiStacked, setOiStacked] = useState([]);
    const [oiCombined, setOiCombined] = useState([]);

    const [loading, setLoading] = useState(true);
    const [oiView, setOiView] = useState(() => {
        return JSON.parse(localStorage.getItem("oiView")) || "combined";
    });
    const [chartType, setChartType] = useState(() => {
        return JSON.parse(localStorage.getItem("chartType")) || "line";
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setBinanceOi([])
            setBinanceOiCoin([])
            setBinanceTokens([])
            setBinanceTokensCoin([])
            setBinanceOiCombined([])
            setFtxTokens([])
            setFtxOiCombined([])
            setFtxOi([])
            setOiCombined([])
            setOiStacked([])
            const usdTokens = await getBinanceTokens();
            setBinanceTokens(usdTokens);
            const coinTokens = await getBinanceTokensCoin();
            setBinanceTokensCoin(coinTokens);

            const ftxDataIn = await getFtxData();
            setFtxOi(ftxDataIn);
            const ftxMarkets = await getFtxMarkets(ftxDataIn)
            setFtxTokens(ftxMarkets);

            await updateTokenDict(usdTokens);
            await updateTokenDict(coinTokens);
            await updateTokenDict(ftxMarkets);

            const usdData = await getBinanceOi(usdTokens);
            setBinanceOi(usdData);
            const coinData = await getBinanceOiCoin(coinTokens);
            setBinanceOiCoin(coinData);

            const mergedBinanceData = await mergeBinanceData(usdData.concat(coinData));
            setBinanceOiCombined(mergedBinanceData);

            const mergedFtxData = await mergeFtxData(ftxDataIn);
            setFtxOiCombined(mergedFtxData);

            const stackedData = await stackData(mergedBinanceData, mergedFtxData);
            setOiStacked(stackedData);

            const combinedData = await mergeAllData(stackedData);
            setOiCombined(combinedData);

            setLoading(false);
            localStorage.setItem("oiView", JSON.stringify(oiView));
        }
        fetchData();


    }, [])

    useEffect(() => {
        const updateData = async () => {
            if (!(loading)) {
                const mergedBinanceData = await mergeBinanceData(binanceOi.concat(binanceOiCoin));
                setBinanceOiCombined(mergedBinanceData);

                const mergedFtxData = await mergeFtxData(ftxOi);
                setFtxOiCombined(mergedFtxData);

                const mergedAllData = await stackData(mergedBinanceData, mergedFtxData);
                setOiStacked(mergedAllData);

                const combinedData = await mergeAllData(mergedAllData);
                setOiCombined(combinedData);
            }
        }
        updateData();
    }, [tokenDict])


    function updateDict(token) {
        if (tokenDict[token] === 1) {
            setTokenDict({...tokenDict, [token]: 0})
        } else {
            setTokenDict({...tokenDict, [token]: 1})
        }
        localStorage.setItem("tokenDict", JSON.stringify(tokenDict));
    }

    async function updateTokenDict(tokenList) {
        const tokenObj = tokenDict;
        await tokenList.forEach((x) => {
            if (!(x in tokenObj)) {
                tokenObj[x] = 1;
            }
        })
        setTokenDict(tokenObj)
        localStorage.setItem("tokenDict", JSON.stringify(tokenObj));
    }


    async function mergeBinanceData(data) {
        const r = {};
        await data.forEach((o, i) => {
            // const symbolName = ('symbol' in o.data[0]) ? o.data[0].symbol : o.data[0].symbol;
            // console.log(tokenDict[symbolName])
            // console.log(symbolName)
            // console.log(o.data[0])
            o.forEach(function (x) {
                r[x.timestamp] = (r[x.timestamp] || 0) + (parseFloat(x.sumOpenInterestValue) * tokenDict[x.symbol]);
            })

        })
        const result = Object.keys(r).map(function (k) {
            return {timestamp: parseInt(k), binance: r[k]}
        });
        result.sort(function (a, b) {
            return a.timestamp - b.timestamp;
        });
        return result;
    }

    async function mergeFtxData(data) {
        const r = {};
        await data[0].forEach((x, i) => {
            r[x.timestamp] = (r[x.timestamp] || 0) + (parseFloat(x.oi) * tokenDict[x.name]);
        })
        const result = Object.keys(r).map(function (k) {
            return {timestamp: parseInt(k) * 1000, ftx: r[k]}
        });
        result.sort(function (a, b) {
            return a.timestamp - b.timestamp;
        });
        return result;
    }

    async function stackData(binance, ftx) {
        const newBinance = await binance.filter((el) => {
            return el.timestamp >= ftx[0].timestamp
        });
        let arr3 = newBinance.map((item, i) => Object.assign({}, item, ftx[i]));
        // console.log(arr3)
        return arr3;
    }

    async function mergeAllData(data) {
        // console.log(data)
        const newArr = [];
        await data.forEach((el) => {
            newArr.push({timestamp: el.timestamp, oi: el.ftx + el.binance})
        });
        // console.log(newArr)
        return newArr;
    }

    async function getBinanceTokens() {
        const data = [];
        await axios.get("https://fapi.binance.com/fapi/v1/exchangeInfo").then(response => {
                response.data.symbols.map((tokenData, index) => {
                    // setBinanceTokens(oldData => [...oldData, tokenData.symbol])
                    data.push(tokenData.symbol)
                })
            }
        )
        return data;
    }

    async function getFtxData() {
        const data = [];
        await axios.get("https://871bd6ba9d63.ngrok.io/ftxoi").then(response => {
            data.push(response.data.results)
        })
        return data;
    }

    async function getFtxMarkets(data) {
        const markets = [];
        await data[0].forEach((x, i) => {
            // console.log(x)
            markets.push(x.name)

        })
        const unique = markets.filter((v, i, a) => a.indexOf(v) === i);
        // console.log(unique)
        return unique;
    }

    async function getBinanceTokensCoin() {
        const data = [];
        await axios.get("https://dapi.binance.com/dapi/v1/exchangeInfo").then(response => {
                response.data.symbols.map((tokenData, index) => {
                    // setBinanceTokensCoin(oldData => [...oldData, tokenData.symbol])
                    data.push(tokenData.symbol)
                    // console.log(tokenData)
                })
            }
        )
        return data;
    }

    async function getBinanceOi(tokens) {
        const data = [];
        const prefix = "https://fapi.binance.com/futures/data/openInterestHist?symbol=";
        await Promise.all(tokens.map(u => axios.get(prefix + u + "&period=15m&limit=500")))
            .then(responses => {
                    responses.map((results) => {
                            data.push(results.data)
                        }
                    )
                }
            )
        return data;
    }

    async function getBinanceOiCoin(tokens) {
        const data = [];
        const prefix = "https://dapi.binance.com/futures/data/openInterestHist?pair=";
        await Promise.all(tokens.map((u, i) => axios.get(prefix + u.split("_")[0] + "&period=15m&limit=500&contractType=ALL")))
            .then((responses, index) => {
                    // console.log(responses)
                    // console.log(tokens)
                    // console.log(index)
                    // console.log(tokens[index])
                    responses.map((results, i) => {
                            // data.push(results)
                            // console.log(i)
                            // console.log(tokens[i])
                            // console.log(results)
                            const tokenData = [];
                            results.data.map((token) => {
                                // console.log(token)
                                tokenData.push({...token, symbol: tokens[i]})
                            })
                            // console.log(tokenData);
                            data.push(tokenData)
                        }
                    )
                }
            )
        return data;
    }

    return (
        <div className="px-8 mx-auto">
            <div
                className="flex flex-col content-start items-center gap-2 px-4 py-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-lg">

                <div className="flex flex-row w-full gap-4 items-center">
                    <div className={`${loading ? " hidden " : "  "}` + " m-auto w-full flex flex-col"}>
                        <div className="flex flex-row gap-5 justify-center mb-4">
                            <button
                                className={`${oiView === 'combined' ? " " : "text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}
                                onClick={() => setOiView('combined')}>combined
                            </button>
                            <button
                                className={`${oiView === 'binance' ? " " : "text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}
                                onClick={() => setOiView('binance')}>binance
                            </button>
                            <button
                                className={`${oiView === 'ftx' ? " " : "text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}
                                onClick={() => setOiView('ftx')}>ftx
                            </button>
                            {/*<button*/}
                            {/*    className={`${oiView === 'weighted' ? " " : "text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}*/}
                            {/*    onClick={() => setOiView('weighted')}>weighted*/}
                            {/*</button>*/}
                        </div>
                        <div className={`${oiView === 'combined' ? " " : " hidden "}` + " m-auto w-full flex flex-col"}>
                            <div className="flex flex-row gap-5 justify-center mb-4">
                                <button
                                    className={`${chartType === 'line' ? " " : "text-sm text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}
                                    onClick={() => setChartType('line')}>total
                                </button>
                                <button
                                    className={`${chartType === 'stacked' ? " " : "text-sm text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}
                                    onClick={() => setChartType('stacked')}>stacked
                                </button>
                            </div>
                            <CombinedOiView
                                stackedData={oiStacked}
                                totalData={oiCombined}
                                tokenDict={tokenDict}
                                chartType={chartType}
                            />
                        </div>
                        <div className={`${oiView === 'binance' ? " " : " hidden "}` + " m-auto w-full flex flex-col"}>
                            <BinanceOiView chartData={binanceOiCombined} tokenDict={tokenDict}/>
                        </div>
                        <div className={`${oiView === 'ftx' ? " " : " hidden "}` + " m-auto w-full flex flex-col"}>
                            <FtxOiView chartData={ftxOiCombined} tokenDict={tokenDict}/>
                        </div>
                        <div
                            className={`${(oiView === 'binance') || (oiView === 'combined') ? " " : " hidden "}` + " mb-4 "}>
                            <h1>binance usd margined markets</h1>
                            <div
                                className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-12 gap-2 text-xs justify-center px-4 text-center mt-4">
                                {binanceTokens.map((token, index) => (
                                    <div
                                        key={token}
                                        className="items-center text-center">
                                        <button
                                            className={`${tokenDict[token] === 1 ? " " : "text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}
                                            onClick={() => updateDict(token)}>{token}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div
                            className={`${(oiView === 'binance') || (oiView === 'combined') ? " " : " hidden "}` + " mb-4 "}>
                            <h1>binance coin margined markets</h1>
                            <div
                                className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-12 gap-2 text-xs justify-center px-4 text-center mt-4">
                                {binanceTokensCoin.map((token, index) => (
                                    <div
                                        key={token}
                                        className="items-center text-center">
                                        <button
                                            className={`${tokenDict[token] === 1 ? " " : "text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}
                                            onClick={() => updateDict(token)}>{token}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div
                            className={`${(oiView === 'ftx') || (oiView === 'combined') ? " " : " hidden "}` + " mb-4"}>
                            <h1>ftx markets</h1>
                            <div
                                className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-12 gap-2 text-xs justify-center px-4 text-center mt-4">
                                {ftxTokens.map((token, index) => (
                                    <div
                                        key={token}
                                        className="items-center text-center">
                                        <button
                                            className={`${tokenDict[token] === 1 ? " " : "text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}
                                            onClick={() => updateDict(token)}>{token}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div
                        className={`${loading ? " " : " hidden "}` + "flex flex-col content-start items-center px-4 text-gray-600 dark:text-gray-300 mx-auto my-auto"}>
                        <p>loading...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


