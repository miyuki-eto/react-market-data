import React, {useEffect, useState} from 'react';
import axios from "axios";
import axiosThrottle from 'axios-request-throttle';

// import OpenInterestTable from "../components/openInterestTable"
import OpenInterestChart from "../components/openInterestChart";

// const dataForge = require('data-forge');

axiosThrottle.use(axios, {requestsPerSecond: 9});

export default function OpenInterestAgg() {
    const [binanceOi, setBinanceOi] = useState([]);
    const [binanceTokens, setBinanceTokens] = useState([]);
    const [binanceOiCombined, setBinanceOiCombined] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState(() => {
        return JSON.parse(localStorage.getItem("timeframe")) || "1h";
    });
    const [exchange, setExchange] = useState(() => {
        return JSON.parse(localStorage.getItem("exchange")) || "binance";
    });

    // const binanceTickers = ["BTCUSDT", "ETHUSDT", "LINKUSDT", "UNIUSDT", "DOTUSDT", "SNXUSDT", "SUSHIUSDT", "BNBUSDT", "AAVEUSDT", "YFIUSDT", "MKRUSDT", "SOLUSDT", "LTCUSDT", "DOGEUSDT"];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setBinanceOi([])
            setBinanceOiCombined([])
            getBinanceOiData(binanceTokens, timeframe)
            // combineData()
            // setLoading(false)
            localStorage.setItem("timeframe", JSON.stringify(timeframe))
            localStorage.setItem("exchange", JSON.stringify(exchange))
        }
        setBinanceTokens([]);
        getBinanceTokens();
        fetchData();


    }, [timeframe])

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
    }

    function combineData() {
        const combList = binanceOi.map((tokenData, index) => {
            return tokenData.data.map(item => item['sumOpenInterestValue']);
        });
        console.log(binanceOi);
        const timeList = binanceOi.map((tokenData, index) => {
            return tokenData.data.map(item => item['timestamp']);
        });
        const sumData = combList.reduce(function (r, a) {
            a.forEach(function (b, i) {
                r[i] = (r[i] || 0) + b;
            });
            return r;
        }, []);
        const data = timeList.map((x, i) => ({
            timestamp: timeList[0][i]
        }));
        console.log(data);


        setBinanceOiCombined(data);
        // setLoading(false);
    }


    function useToggle() {
        const [show, setShow] = React.useState(false);
        const ref = React.useRef(null);

        const toggle = React.useCallback(() => {
            setShow((prevState) => !prevState);
        }, []);

        // close dropdown when you click outside
        React.useEffect(() => {
            const handleOutsideClick = (event) => {
                if (!ref.current?.contains(event.target)) {
                    if (!show) return;
                    setShow(false);
                }
            };
            window.addEventListener('click', handleOutsideClick);
            return () => window.removeEventListener('click', handleOutsideClick);
        }, [show, ref]);

        // close dropdown when you click on "ESC" key
        React.useEffect(() => {
            const handleEscape = (event) => {
                if (!show) return;

                if (event.key === 'Escape') {
                    setShow(false);
                }
            };
            document.addEventListener('keyup', handleEscape);
            return () => document.removeEventListener('keyup', handleEscape);
        }, [show]);

        return {
            show,
            toggle,
            ref,
        };
    }

    const style = {
        item: `block w-full py-1 px-8 mb-2 text-sm font-normal clear-both whitespace-nowrap border-0 hover:bg-gray-200 cursor-pointer`,
        menu: `block z-30 absolute top-0 left-0 bg-white float-left py-2 px-0 text-left border border-gray-300 rounded-sm mt-0.5 mb-0 mx-0 bg-clip-padding`,
    };

    function Dropdown({children}) {
        const {show, toggle} = useToggle();
        /* First child contains the dropdown toggle */
        const dropdownToggle = children[0];

        /* Second child contains the dropdown menu */
        const dropdownMenu = children[1];

        return (
            <>
                <button
                    className="focus:outline-none"
                    onClick={toggle}
                    type="button"
                    id="options-menu"
                    aria-expanded="true"
                    aria-haspopup="true"
                >
                    {dropdownToggle}
                </button>
                {show && <>{dropdownMenu}</>}
            </>
        );
    }

    function DropdownToggle({children}) {
        return <>{children}</>;
    }

    function DropdownMenu({children}) {
        return (
            <div className="relative">
                <div
                    style={{transform: 'translate3d(0px, 3px, 0px)'}}
                    className={style.menu}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                >
                    {children}
                </div>
            </div>
        );
    }

    /* You can wrap the a tag with Link and pass href prop to Link if you are using either Create-React-App, Next.js or Gatsby */
    function DropdownItem({children}) {
        return (
            <a tabIndex={0} className={style.item} role="menuitem">
                {children}
            </a>
        );
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
                        <Dropdown>
                            <DropdownToggle>
                              <span className="flex rounded px-6 py-2">
                                token
                                <svg
                                    className="-mr-1 ml-2 h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                  <path
                                      fillRule="evenodd"
                                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </DropdownToggle>
                            <DropdownMenu>
                                {binanceTokens.map((tokenName, index) => (
                                    <DropdownItem key={index}>{tokenName}</DropdownItem>
                                ))}
                                {/*<DropdownItem>Enoch Ndika</DropdownItem>*/}
                                {/*<DropdownItem>Josue Kazenga</DropdownItem>*/}
                                {/*<DropdownItem>Business</DropdownItem>*/}
                            </DropdownMenu>
                        </Dropdown>
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
