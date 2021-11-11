import React, {useEffect, useState} from 'react';
import axios from "axios";
import axiosThrottle from 'axios-request-throttle';

import OpenInterestChart from "../components/openInterestChart";

axiosThrottle.use(axios, {requestsPerSecond: 9});

export default function OpenInterestAll() {
    const [binanceTokens, setBinanceTokens] = useState([]);
    const [binanceTokensCoin, setBinanceTokensCoin] = useState([]);
    const [binanceTokensCoinType, setBinanceTokensCoinType] = useState([]);
    const [weights, setWeights] = useState(() => {
        return JSON.parse(localStorage.getItem("tokenBool")) || [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    });
    const [weightsCoin, setWeightsCoin] = useState(() => {
        return JSON.parse(localStorage.getItem("tokenCoinBool")) || [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    });

    const [binanceOi, setBinanceOi] = useState([]);
    const [binanceOiCoin, setBinanceOiCoin] = useState([]);
    const [binanceOiCombined, setBinanceOiCombined] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState(() => {
        return JSON.parse(localStorage.getItem("timeframe")) || "1h";
    });

    function updateWeights(index) {
        let weightsCopy = [...weights];
        if (weightsCopy[index] === 1) {
            weightsCopy[index] = 0;
        } else {
            weightsCopy[index] = 1;
        }
        setWeights(weightsCopy);
    }

    function updateWeightsCoin(index) {
        let weightsCopy = [...weightsCoin];
        if (weightsCopy[index] === 1) {
            weightsCopy[index] = 0;
        } else {
            weightsCopy[index] = 1;
        }
        setWeightsCoin(weightsCopy);
    }

    function initWeights(tokens) {
        const arr = [];
        const len = tokens.length;
        for (let i = 1; i <= len; i++) {
            arr.push(1);
        }
        setWeights(arr)
    }

    function initWeightsCoin(tokens) {
        const arr = [];
        const len = tokens.length;
        for (let i = 1; i <= len; i++) {
            arr.push(1);
        }
        setWeightsCoin(arr)
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setBinanceOi([])
            setBinanceOiCoin([])
            setBinanceTokens([])
            setBinanceTokensCoin([])
            setBinanceTokensCoinType([])
            const usdTokens = await getBinanceTokens();
            setBinanceTokens(usdTokens)

            const coinTokens = await getBinanceTokensCoin();
            setBinanceTokensCoin(coinTokens)
            initWeights(usdTokens);
            initWeightsCoin(coinTokens);
            const usdData = await getBinanceOi(usdTokens);
            setBinanceOi(usdData)
            const coinData = await getBinanceOiCoin(coinTokens);
            setBinanceOiCoin(coinData)
            setBinanceOi(usdData.concat(coinData))
            console.log(usdData.concat(coinData))
            // stackData();
            // console.log(usdData)
            const mergedData = await mergeData(usdData.concat(coinData), weights.concat(weightsCoin));
            setBinanceOiCombined(mergedData)
            setLoading(false);
            // getBinanceOiData(binanceTokens, binanceTokensCoin, timeframe)
            // combineData()
            // setLoading(false)
            localStorage.setItem("timeframe", JSON.stringify(timeframe))
        }
        fetchData();


    }, [timeframe])

    useEffect(() => {
        const updateData = async () => {
            setBinanceOiCombined([]);
            const mergedData = await mergeData(binanceOi.concat(binanceOiCoin), weights.concat(weightsCoin));
            setBinanceOiCombined(mergedData)
            localStorage.setItem("tokenBool", JSON.stringify(weights));
            localStorage.setItem("tokenCoinBool", JSON.stringify(weightsCoin));
            // setLoading(false);
        }
        updateData();
    }, [weights, weightsCoin, loading])


    async function mergeData(data, weight) {
        const r = {};
        console.log(weight)
        console.log(data.length)
        await data.forEach((o, i) => {
            // console.log(weight[i])
            // console.log(o.data)
            o.data.forEach(function (x){
                // console.log(x)
                r[x.timestamp] = (r[x.timestamp] || 0) + (parseFloat(x.sumOpenInterestValue) * weight[i]);
            })

        })
        const result = Object.keys(r).map(function(k){
            return { timestamp: parseInt(k), sumOpenInterestValue: r[k] }
        });
        result.sort(function(a, b) {
            return a.timestamp - b.timestamp;
        });
        // console.log(result);
        return result
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

    async function getBinanceTokensCoin() {
        const data = [];
        await axios.get("https://dapi.binance.com/dapi/v1/exchangeInfo").then(response => {
                response.data.symbols.map((tokenData, index) => {
                    // setBinanceTokensCoin(oldData => [...oldData, tokenData.symbol])
                    data.push(tokenData.symbol)
                })
            }
        )
        return data;
    }

    async function getBinanceOi(tokens) {
        const data = [];
        const prefix = "https://fapi.binance.com/futures/data/openInterestHist?symbol=";
        await Promise.all(tokens.map(u => axios.get(prefix + u + "&period=" + timeframe + "&limit=500")))
            .then(responses => {
                    responses.map((results) => {
                            data.push(results)
                        }
                    )
                }
            )
        return data;
    }

    async function getBinanceOiCoin(tokens) {
        const data = [];
        const prefix = "https://dapi.binance.com/futures/data/openInterestHist?pair=";
        await Promise.all(tokens.map((u, i) => axios.get(prefix + u.split("_")[0] + "&period=" + timeframe + "&limit=500&contractType=" + binanceTokensCoinType[i])))
            .then(responses => {
                    responses.map((results) => {
                            data.push(results)
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
                        <div className="flex justify-center mb-4">
                            <h1 className="">all open interest</h1>
                        </div>
                        <OpenInterestChart chartData={binanceOiCombined} chartHeight={420} chartTitle=""/>
                        <div className="flex flex-row gap-1 justify-center">
                            <button
                                className={`${timeframe === '4h' ? " " : "text-gray-300 dark:text-gray-700 "}` + "w-12 rounded-lg"}
                                onClick={() => setTimeframe('4h')}>4h
                            </button>
                            <button
                                className={`${timeframe === '1h' ? " " : "text-gray-300 dark:text-gray-700 "}` + "w-12 rounded-lg"}
                                onClick={() => setTimeframe('1h')}>1h
                            </button>
                            <button
                                className={`${timeframe === '15m' ? " " : "text-gray-300 dark:text-gray-700 "}` + "w-12 rounded-lg"}
                                onClick={() => setTimeframe('15m')}>15m
                            </button>
                        </div>
                        <div>
                            <h1 className="">binance usd-margined futures</h1>
                            <div
                                className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-12 gap-2 text-xs justify-center px-4 text-center mt-4">
                                {binanceTokens.map((token, index) => (
                                    <div
                                        key={token}
                                        className="items-center text-center">
                                        <button
                                            className={`${weights[index] === 1 ? " " : "text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}
                                            onClick={() => updateWeights(index)}>{token}
                                        </button>
                                    </div>
                                ))}

                            </div>
                            <h1 className="mt-4">binance coin-margined futures</h1>
                            <div
                                className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-12 gap-2 text-xs justify-center px-4 text-center mt-4">
                                {binanceTokensCoin.map((token, index) => (
                                    <div
                                        key={token}
                                        className="items-center text-center">
                                        <button
                                            className={`${weights[index + binanceTokens.length] === 1 ? " " : "text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}
                                            onClick={() => updateWeights(index + binanceTokens.length)}>{token}
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
