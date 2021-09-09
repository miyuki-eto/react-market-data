import React, {useEffect, useState}  from 'react';
import axios from "axios";
import axiosThrottle from 'axios-request-throttle';

axiosThrottle.use(axios, { requestsPerSecond: 2 });

export default function OpenInterest() {
    const [dataOiALL, setDataOiALL] = useState([]);
    const [dataOiEX, setDataOiEX] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [ loading, setloading ] = useState(true);

    function updateData() {
        const tokens = ["BTC", "ETH", "LINK", "UNI", "DOT", "SNX", "SUSHI", "BNB", "AAVE", "YFI", "MKR", "SOL", "LTC", "DOGE"];
        // const tokens = ["BTC", "ETH"];
        setDataOiALL([])
        setDataOiEX([])
        setChartData([])
        getDataExchangeOi(tokens)
        getDataChartOi(tokens)

    }

    useEffect(() => {
        updateData()
        setloading(false)
    }, [])

    function getDataExchangeOi(tokens) {
        const prefix = "https://fapi.bybt.com/api/openInterest/pc/info?symbol=";
        Promise.all(tokens.map(u => axios.get(prefix + u)))
            .then(responses =>
                responses.map(results => {
                        setDataOiALL(oldData => [...oldData, results.data.data[0]])
                        results.data.data.map((result, i) => {
                                if (!(i === 0)) {
                                    setDataOiEX(oldData => [...oldData, result])
                                }
                            }
                        )
                    }
                )
            )
    }

    function getDataChartOi(tokens) {
        const prefix = "https://fapi.bybt.com/api/openInterest/v3/chart?symbol=";
        Promise.all(tokens.map(u => axios.get(prefix + u + "&timeType=10&exchangeName=&type=0")))
            .then(responses =>
                responses.map(response => {
                        const result = Object.keys(response.data.data.dataMap).reduce(function (r, k) {
                            response.data.data.dataMap[k].forEach(function (a, i) {
                                r[i] = (r[i] || 0) + a;
                            });
                            return r;
                        }, []);
                        // console.log(result)
                        const prices = response.data.data.priceList
                        const dates = response.data.data.dateList.map(x => new Date(x).toLocaleTimeString("en-US"))
                        const data = result.map((x, i) => ({
                            oi: x,
                            price: prices[i],
                            date: dates[i]
                        }));
                        setChartData(oldData => [...oldData, data])
                        // console.log(data)
                    }
                )
            )

    }

    return (
        <div className="px-8 mx-auto ">
            <div className={`${loading ? " " : " hidden "}` + "flex flex-col content-start items-center px-4 text-gray-600 dark:text-gray-300"}>
                <p>loading...</p>
            </div>
            <div className={`${loading ? " hidden " : "  "}` + "flex flex-col content-start items-center px-4 text-gray-600 dark:text-gray-300"}>
                <p>Open Interest</p>
            </div>
        </div>
    );
}
