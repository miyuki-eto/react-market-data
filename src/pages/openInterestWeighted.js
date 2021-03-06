import React, {useEffect, useState} from 'react';
import axios from "axios";
import axiosThrottle from 'axios-request-throttle';

// import OpenInterestTable from "../components/openInterestTable"
import BasicChart from "../components/charts/basicChart";

// const dataForge = require('data-forge');

axiosThrottle.use(axios, {requestsPerSecond: 9});

export default function OpenInterestWeighted() {
    const [weights, setWeights] = useState(() => {
        return JSON.parse(localStorage.getItem("weights")) || [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    });
    const [binanceOi, setBinanceOi] = useState([]);
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
            getBinanceOiData(binanceTickers, timeframe)
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

    function combineData() {
        const combList = binanceOi.map((tokenData, index) => {
            return tokenData.data.map(item => item['sumOpenInterestValue'] * weights[index]);
        });
        const timeList = binanceOi.map((tokenData, index) => {
            return tokenData.data.map(item => item['timestamp']);
        });
        const sumData = combList.reduce(function (r, a) {
            a.forEach(function (b, i) {
                r[i] = (r[i] || 0) + b;
            });
            return r;
        }, []);
        const data = sumData.map((x, i) => ({
            sumOpenInterestValue: x,
            timestamp: timeList[0][i]
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
                setLoading(false);
                combineData();
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
                            className="flex flex-col justify-center ml-4 text-center border-r border-gray-300 dark:border-gray-700">
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
                    <div className={`${loading ? " hidden " : "  "}` + " m-auto w-full flex flex-col"}>
                        <div className="flex justify-center mb-4">
                            <h1 className="">weighted open interest</h1>
                        </div>
                        <BasicChart chartData={binanceOiCombined} chartHeight={420} chartTitle=""/>
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
