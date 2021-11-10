import React, {useEffect, useState} from 'react';
import axios from "axios";
import axiosThrottle from 'axios-request-throttle';

// import OpenInterestTable from "../components/openInterestTable"
import OpenInterestChart from "../components/openInterestChart";
import StackedAreaChart from "../components/stackedAreaChart";

// const dataForge = require('data-forge');

axiosThrottle.use(axios, {requestsPerSecond: 9});

export default function OpenInterestAgg() {
    const [binanceTokens, setBinanceTokens] = useState([]);
    const [binanceOi, setBinanceOi] = useState([]);
    const [binanceOiCombined, setBinanceOiCombined] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState(() => {
        return JSON.parse(localStorage.getItem("timeframe")) || "1h";
    });
    const [exchange, setExchange] = useState(() => {
        return JSON.parse(localStorage.getItem("exchange")) || "binance";
    });

    const binanceTickers = ["BTCUSDT", "ETHUSDT", "LINKUSDT", "UNIUSDT", "DOTUSDT", "SNXUSDT", "SUSHIUSDT", "BNBUSDT", "AAVEUSDT", "YFIUSDT", "MKRUSDT", "SOLUSDT", "LTCUSDT", "DOGEUSDT"];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setBinanceOi([])
            setBinanceOiCombined([])
            setBinanceTokens([]);
            await getBinanceTokens();
            await getBinanceOiData(binanceTokens, timeframe);
            stackData();
            // combineData()
            // setLoading(false)
            localStorage.setItem("timeframe", JSON.stringify(timeframe))
            localStorage.setItem("exchange", JSON.stringify(exchange))
        }

        fetchData();
        // stackData();


    }, [timeframe])

    function getBinanceOiData(tokens, timeframe) {
        const prefix = "https://fapi.binance.com/futures/data/openInterestHist?symbol=";
        Promise.all(tokens.map(u => axios.get(prefix + u + "&period=" + timeframe + "&limit=500")))
            .then(responses => {
                    responses.map((results, index) => {
                            setBinanceOi(oldData => [...oldData, results.data])
                            // console.log(results.data)
                        }
                    )
                    setLoading(false);
                    // combineData();
                    // stackData();

                }
            )
        return binanceOi
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
        // console.log(binanceTokens)
        return binanceTokens
    }

    function stackData() {
        const arr = binanceOi;
        const newArr = [];
        for (let i = 0; i < arr[0].length; i++) {
            const pointData = {};
            pointData['timestamp'] = arr[0][i].timestamp
            for (let j = 0; j < arr.length; j++) {
                const oldData = arr[j][i];
                pointData[oldData.symbol] = oldData.sumOpenInterestValue;
            }
            newArr.push(pointData)
        }
        setBinanceOiCombined(newArr)
        console.log(newArr)
    }

    function combineData() {
        const combList = binanceOi.map((tokenData, index) => {
            return tokenData.data.map(item => item['sumOpenInterestValue']);
        });
        console.log(binanceOi);
        console.log(combList);
        const timeList = binanceOi.map((tokenData, index) => {
            return tokenData.data.map(item => item['timestamp']);
        });
        const sumData = combList.reduce(function (r, a) {
            a.forEach(function (b, i) {
                r[i] = (r[i] || 0) + b;
            });
            return r;
        }, []);
        // const data = timeList.map((x, i) => (
        //     combList.map((y, h) => (
        //         // console.log(y)
        //     ))
        //     // timestamp: timeList[0][i]
        // ));
        // console.log(data);


        // setBinanceOiCombined(data);
        // setLoading(false);
    }


    return (
        <div className="px-8 mx-auto">
            <div
                className="flex flex-col content-start items-center gap-2 px-4 py-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-lg">

                <div className="flex flex-row w-full gap-4 items-center">

                    <div className={`${loading ? " hidden " : "  "}` + " m-auto w-full flex flex-col"}>
                        <div className="flex flex-row gap-4 justify-center">
                            <div className="flex flex-row gap-1 justify-center mr-10">
                                <button
                                    className={`${exchange === 'binance' ? " " : "text-gray-300 dark:text-gray-700 "}` + "w-12 rounded-lg"}
                                    onClick={() => setExchange('binance')}>binance
                                </button>
                                {/*<button*/}
                                {/*    className={`${exchange === 'ftx' ? " " : "text-gray-300 dark:text-gray-700 "}` + "w-12 rounded-lg"}*/}
                                {/*    onClick={() => setExchange('ftx')}>ftx*/}
                                {/*</button>*/}
                                {/*<button*/}
                                {/*    className={`${exchange === 'combined' ? " " : "text-gray-300 dark:text-gray-700 "}` + "w-12 rounded-lg"}*/}
                                {/*    onClick={() => setExchange('combined')}>combined*/}
                                {/*</button>*/}
                            </div>
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
                        </div>
                        <StackedAreaChart chartData={binanceOiCombined}
                                          chartHeight={420}
                                          chartTitle="oi"
                                          tokens={binanceTokens}/>
                        {/*{binanceOi.map((tokenData, index) => (*/}
                        {/*    <OpenInterestChart chartData={tokenData.data} chartHeight={200}*/}
                        {/*                       chartTitle={binanceTokens[index]} key={index}/>*/}
                        {/*))}*/}
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
