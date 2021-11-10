import React, {useEffect, useState} from 'react';
import axios from "axios";
import axiosThrottle from 'axios-request-throttle';

// import OpenInterestTable from "../components/openInterestTable"
import OpenInterestChart from "../components/openInterestChart";

// const dataForge = require('data-forge');

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

    const binanceTickers = ["BTCUSDT", "ETHUSDT", "LINKUSDT", "UNIUSDT", "DOTUSDT", "SNXUSDT", "SUSHIUSDT", "BNBUSDT", "AAVEUSDT", "YFIUSDT", "MKRUSDT", "SOLUSDT", "LTCUSDT", "DOGEUSDT"];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setBinanceOi([])
            setBinanceOiCoin([])
            setBinanceTokens([])
            setBinanceTokensCoin([])
            setBinanceTokensCoinType([])
            getBinanceOiData(binanceTokens, binanceTokensCoin, timeframe)
            // combineData()
            // setLoading(false)
            localStorage.setItem("timeframe", JSON.stringify(timeframe))
        }
        fetchData();


    }, [timeframe])

    useEffect(() => {
        setBinanceOiCombined([]);
        combineData();
        localStorage.setItem("tokenBool", JSON.stringify(weights));
        localStorage.setItem("tokenCoinBool", JSON.stringify(weights));
        // setLoading(false);
    }, [weights, weightsCoin, loading])


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

    function getBinanceOiData(tokens, tokensCoin, timeframe) {
        axios.get("https://fapi.binance.com/fapi/v1/exchangeInfo").then(response => {
                // console.log(response.data)
                response.data.symbols.map((tokenData, index) => {
                    setBinanceTokens(oldData => [...oldData, tokenData.symbol])
                })
            }
        )
        axios.get("https://dapi.binance.com/dapi/v1/exchangeInfo").then(response => {
                // console.log(response.data)
                response.data.symbols.map((tokenData, index) => {
                    setBinanceTokensCoin(oldData => [...oldData, tokenData.symbol]);
                    setBinanceTokensCoinType(oldData => [...oldData, tokenData.contractType]);
                })
            }
        )
        const prefix = "https://fapi.binance.com/futures/data/openInterestHist?symbol=";
        Promise.all(tokens.map(u => axios.get(prefix + u + "&period=" + timeframe + "&limit=500")))
            .then(responses => {
                    responses.map((results, index) => {
                            setBinanceOi(oldData => [...oldData, results])
                        }
                    )
                    // setLoading(false);
                initWeights(binanceTokens);
                }
            )
        const prefixCoin = "https://dapi.binance.com/futures/data/openInterestHist?pair=";
        Promise.all(tokensCoin.map((u, i) => axios.get(prefixCoin + u.split("_")[0] + "&period=" + timeframe + "&limit=500&contractType=" + binanceTokensCoinType[i])))
            .then(responses => {
                console.log(responses)
                    responses.map((results, index) => {
                        console.log(results)
                            setBinanceOiCoin(oldData => [...oldData, results])
                        }
                    )
                    setLoading(false);

                    initWeightsCoin(binanceTokensCoin);
                    combineData();
                }

            )
    }

    function getBinanceTokens() {
        const url = "https://fapi.binance.com/fapi/v1/exchangeInfo";
        axios.get(url).then(response => {
                // console.log(response.data)
                response.data.symbols.map((tokenData, index) => {
                    setBinanceTokens(oldData => [...oldData, tokenData.symbol])
                })
            }
        )
    }

    return (
        <div className="px-8 mx-auto">
            <div
                className="flex flex-col content-start items-center gap-2 px-4 py-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-lg">

                <div className="flex flex-row w-full gap-4 items-center">
                    <div>

                        {/*<div className="flex flex-row rounded-lg gap-1 justify-center">*/}
                        {/*    <button className="w-16 rounded-lg"*/}
                        {/*            onClick={() => combineData()}>update*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </div>
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
                                        {/*<p>{token}</p>*/}
                                        {/*<input type="number"*/}
                                        {/*       onChange={(e) => updateWeights(index)}*/}
                                        {/*       defaultValue={weights[index]}*/}
                                        {/*       className="px-3 py-1 w-20 bg-white dark:bg-custom-gray-a"/>*/}
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
                                        {/*<p>{token}</p>*/}
                                        {/*<input type="number"*/}
                                        {/*       onChange={(e) => updateWeights(index)}*/}
                                        {/*       defaultValue={weights[index]}*/}
                                        {/*       className="px-3 py-1 w-20 bg-white dark:bg-custom-gray-a"/>*/}
                                        <button
                                            className={`${weightsCoin[index] === 1 ? " " : "text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}
                                            onClick={() => updateWeightsCoin(index)}>{token}
                                        </button>
                                    </div>
                                ))}

                            </div>
                            {/*<h1 className="mt-4">ftx futures</h1>*/}
                            {/*<div*/}
                            {/*    className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-12 gap-2 text-xs justify-center px-4 text-center mt-4">*/}
                            {/*    {binanceTokensCoin.map((token, index) => (*/}
                            {/*        <div*/}
                            {/*            key={token}*/}
                            {/*            className="items-center text-center">*/}
                            {/*            /!*<p>{token}</p>*!/*/}
                            {/*            /!*<input type="number"*!/*/}
                            {/*            /!*       onChange={(e) => updateWeights(index)}*!/*/}
                            {/*            /!*       defaultValue={weights[index]}*!/*/}
                            {/*            /!*       className="px-3 py-1 w-20 bg-white dark:bg-custom-gray-a"/>*!/*/}
                            {/*            <button*/}
                            {/*                className={`${weightsCoin[index] === 1 ? " " : "text-gray-300 dark:text-gray-700 "}` + "rounded-lg"}*/}
                            {/*                onClick={() => updateWeightsCoin(index)}>{token}*/}
                            {/*            </button>*/}
                            {/*        </div>*/}
                            {/*    ))}*/}

                            {/*</div>*/}
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
