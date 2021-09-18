import React, {useEffect, useState} from 'react';
import axios from "axios";
import axiosThrottle from 'axios-request-throttle';

// import OpenInterestTable from "../components/openInterestTable"
import OpenInterestChart from "../components/openInterestChart";
import KlineChart from "../components/klineChart";

// const dataForge = require('data-forge');

axiosThrottle.use(axios, {requestsPerSecond: 4});

export default function OpenInterest() {
    const [weights, setWeights] = useState(() => {
        return JSON.parse(localStorage.getItem("weights")) || [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    });
    const [binanceOi, setBinanceOi] = useState([]);
    const [binancePrice, setBinancePrice] = useState([]);
    const [binanceOiCombined, setBinanceOiCombined] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState(() => {
        return JSON.parse(localStorage.getItem("timeframe")) || "1h";
    });

    function updateWeights(value, index) {
        let weightsCopy = [...weights];
        weightsCopy[index] = parseFloat(value);
        setWeights(weightsCopy);
    }

    const binanceTickers = ["BTCUSDT", "ETHUSDT", "LINKUSDT", "UNIUSDT", "DOTUSDT", "SNXUSDT", "SUSHIUSDT", "BNBUSDT", "AAVEUSDT", "YFIUSDT", "MKRUSDT", "SOLUSDT", "LTCUSDT", "DOGEUSDT"];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setBinanceOi([])
            setBinancePrice([])
            getBinanceOiData(binanceTickers, timeframe)
            getBinancePriceData(binanceTickers, timeframe)
            // updateData()
            // combineData()
            // setLoading(false)
            localStorage.setItem("timeframe", JSON.stringify(timeframe))
        }
        fetchData();


    }, [timeframe])

    useEffect(() => {
        setBinanceOiCombined([]);
        combineData();
        localStorage.setItem("weights", JSON.stringify(weights));
        // setLoading(false);
    }, [weights, loading])

    function updateData() {
        setTimeout(() => {
            getBinanceOiData()
            getBinancePriceData()
        }, 60000)
    }

    function combineData() {
        const combList = binanceOi.map((tokenData, index) => {
            return tokenData.data.map(item => item['sumOpenInterestValue'] * weights[index]);
        });
        const timeList = binanceOi.map((tokenData, index) => {
            return tokenData.data.map(item => item['timestamp']);
        });
        const openList = binancePrice.map((tokenData, index) => {
            return tokenData.data.map(item => item[1] * weights[index]);
        });
        const highList = binancePrice.map((tokenData, index) => {
            return tokenData.data.map(item => item[2] * weights[index]);
        });
        const lowList = binancePrice.map((tokenData, index) => {
            return tokenData.data.map(item => item[3] * weights[index]);
        });
        const closeList = binancePrice.map((tokenData, index) => {
            return tokenData.data.map(item => item[4] * weights[index]);
        });
        const volumeList = binancePrice.map((tokenData, index) => {
            return tokenData.data.map(item => item[5] * weights[index]);
        });

        const sumData = combList.reduce(function (r, a) {
            a.forEach(function (b, i) {
                r[i] = (r[i] || 0) + b;
            });
            return r;
        }, []);
        const sumOpen = openList.reduce(function (r, a) {
            a.forEach(function (b, i) {
                r[i] = (r[i] || 0) + b;
            });
            return r;
        }, []);
        const sumHigh = highList.reduce(function (r, a) {
            a.forEach(function (b, i) {
                r[i] = (r[i] || 0) + b;
            });
            return r;
        }, []);
        const sumlow = lowList.reduce(function (r, a) {
            a.forEach(function (b, i) {
                r[i] = (r[i] || 0) + b;
            });
            return r;
        }, []);
        const sumClose = closeList.reduce(function (r, a) {
            a.forEach(function (b, i) {
                r[i] = (r[i] || 0) + b;
            });
            return r;
        }, []);
        const sumVolume = volumeList.reduce(function (r, a) {
            a.forEach(function (b, i) {
                r[i] = (r[i] || 0) + b;
            });
            return r;
        }, []);

        const data = sumData.map((x, i) => ({
            // oi: x,
            timestamp: timeList[0][i],
            open: sumOpen[i],
            high: sumHigh[i],
            low: sumlow[i],
            close: sumClose[i],
            volume: sumVolume[i],
        }));
        setBinanceOiCombined(data);
        // setLoading(false);
    }

    function getBinanceOiData(tokens, timeframe) {
        const prefix = "https://fapi.binance.com/futures/data/openInterestHist?symbol=";
        Promise.all(tokens.map(u => axios.get(prefix + u + "&period=" + timeframe + "&limit=500")))
            .then(responses => {
                    responses.map((results, index) => {
                            setBinanceOi(oldData => [...oldData, results])
                        }
                    )
                // setLoading(false);
                combineData();
                }
            )
    }

    function getBinancePriceData(tokens, timeframe) {
        const prefixPrice = "https://fapi.binance.com/fapi/v1/klines?symbol=";
        Promise.all(tokens.map(u => axios.get(prefixPrice + u + "&interval=" + timeframe + "&limit=500")))
            .then(responses => {
                    responses.map((results, index) => {
                            setBinancePrice(oldData => [...oldData, results])
                        }
                    )
                    setLoading(false);
                    combineData();
                    // console.log(binancePrice)
                }
            )
    }

    return (
        <div className="px-8 mx-auto">
            <div
                className="flex flex-col content-start items-center gap-2 px-4 py-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-lg">

                <div className="flex flex-row w-full gap-4 items-center">
                    <div>
                        <div
                            className="flex flex-col justify-center ml-4 text-center">
                            {binanceTickers.map((token, index) => (
                                <div
                                    key={token}
                                    className="flex flex-row items-center gap-4 text-center justify-between">
                                    <p>{token}</p>
                                    <input type="number"
                                           onChange={(e) => updateWeights(e.target.value, index)}
                                           defaultValue={weights[index]}
                                           className="px-3 py-1 w-20 bg-white dark:bg-custom-gray-a"/>
                                </div>
                            ))}

                        </div>
                        {/*<div className="flex flex-row rounded-lg gap-1 justify-center">*/}
                        {/*    <button className="w-16 rounded-lg"*/}
                        {/*            onClick={() => combineData()}>update*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </div>
                    <div className={`${loading ? " hidden " : "  "}` + " m-auto w-full h-auto flex flex-col"}>
                        {/*<OpenInterestChart chartData={binanceOiCombined}/>*/}
                        <KlineChart dataInput={binanceOiCombined} />
                        <div className="flex flex-row gap-1 justify-center">
                            <button className={`${timeframe === '4h' ? " " : "text-gray-300 dark:text-gray-700 "}` + "w-12 rounded-lg"}
                                    onClick={() => setTimeframe('4h')}>4h
                            </button>
                            <button className={`${timeframe === '1h' ? " " : "text-gray-300 dark:text-gray-700 "}` + "w-12 rounded-lg"}
                                    onClick={() => setTimeframe('1h')}>1h
                            </button>
                            <button className={`${timeframe === '15m' ? " " : "text-gray-300 dark:text-gray-700 "}` + "w-12 rounded-lg"}
                                    onClick={() => setTimeframe('15m')}>15m
                            </button>
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
