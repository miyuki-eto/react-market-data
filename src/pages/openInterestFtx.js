import React, {useEffect, useState} from 'react';
import axios from "axios";
import axiosThrottle from 'axios-request-throttle';
import OpenInterestChart from "../components/openInterestChart";

axiosThrottle.use(axios, {requestsPerSecond: 9});

export default function OpenInterestFtx() {
    const [data, setData] = useState([]);
    const [mergedData, setMergedData] = useState([]);
    const [tokens, setTokens] = useState([]);
    const [weights, setWeights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState(() => {
        return JSON.parse(localStorage.getItem("timeframe")) || "1h";
    });


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setData([])
            setTokens([])
            setWeights([])
            setMergedData([])
            await getData();
            const marketData = await getMarkets(data);
            const weightData = await initWeights(marketData);
            const combinedData = await mergeData(data);
            setMergedData(combinedData)
            setLoading(false);
            localStorage.setItem("timeframe", JSON.stringify(timeframe))
        }
        fetchData();


    }, [timeframe])

    useEffect(() => {
        const fetchData = async () => {
            setMergedData([]);
            const combinedData = await mergeData(data);
            setMergedData(combinedData)
        }
        fetchData();
    }, [weights])

    async function getData() {
        await axios.get("https://c1aedb3907f2.ngrok.io/ftxoi").then(response => {
            setData(response.data.results);
        })
        return [];
    }

    async function getMarkets(data) {
        const markets = [];
        await data.forEach((x, i) => {
                markets.push(x.name)

        })
        const unique = markets.filter((v, i, a) => a.indexOf(v) === i);
        // console.log(unique);
        setTokens(unique);
        return unique;
    }

    async function initWeights(tokens) {
        const arr = [];
        const len = tokens.length;
        for (let i = 1; i <= len; i++) {
            arr.push(1);
        }
        setWeights(arr);
        return arr;
    }

    function updateWeights(index) {
        let weightsCopy = [...weights];
        if (weightsCopy[index] === 1) {
            weightsCopy[index] = 0;
        } else {
            weightsCopy[index] = 1;
        }
        setWeights(weightsCopy);
    }

    async function mergeData(data) {
        const r = {};
        // console.log(weight)
        // console.log(data.length)
        await data.forEach((x, i) => {
            // console.log(weight[i])
            // console.log(x)
            r[x.timestamp] = (r[x.timestamp] || 0) + (parseFloat(x.oi) * weights[tokens.indexOf(x.name)]);
        })
        const result = Object.keys(r).map(function(k){
            return { timestamp: parseInt(k) * 1000, sumOpenInterestValue: r[k] }
        });
        result.sort(function(a, b) {
            return a.timestamp - b.timestamp;
        });
        // console.log(result);
        return result
    }

    return (
        <div className="px-8 mx-auto">
            <div
                className="flex flex-col content-start items-center gap-2 px-4 py-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-lg">

                <div className="flex flex-row w-full gap-4 items-center">
                    <div className={`${loading ? " hidden " : "  "}` + " m-auto w-full flex flex-col"}>
                        <div className="flex justify-center mb-4">
                            <h1 className="">ftx open interest</h1>
                        </div>
                        <OpenInterestChart chartData={mergedData} chartHeight={420} chartTitle=""/>
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
                            <h1 className="">ftx futures</h1>
                            <div
                                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 text-xs justify-center px-4 text-center mt-4">
                                {tokens.map((token, index) => (
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
