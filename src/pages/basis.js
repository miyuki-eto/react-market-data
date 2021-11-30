import React, {useState, useEffect, useRef} from "react";
import BasisCard from "../components/basisCard";

import {ThemeContext} from "../components/structure/themeContext";
import axios from "axios";

export default function Basis({chartData, tokenDict}) {
    const {theme} = React.useContext(ThemeContext);
    const [basis, setBasis] = useState(
        [{
            'coinbase': 0,
            'binance_price': 0,
            'binance_basis': 0,
            'ftx_price': 0,
            'ftx_basis': 0,
            'bitmex_price': 0,
            'bitmex_basis': 0,
            'bybit_price': 0,
            'bybit_basis': 0
        }]
    );
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            const basisData = await getBasisData();
            setBasis(basisData);
            setLoading(false);
        }
        fetchData();

    }, [])

    useInterval(() => {
        const updateData = async () => {
            const basisData = await getBasisData();
            setBasis(basisData);
        }
        updateData();

    }, 60000);


    async function getBasisData() {
        const data = [];
        await axios.get("https://871bd6ba9d63.ngrok.io/basis").then(response => {
            data.push(response.data.results[0])
        })
        return data;
    }

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        // Remember the latest callback.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }

            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    return (
        <div className="px-8 mx-auto">
            <div
                className="flex flex-col content-center items-center gap-2 px-4 py-4 text-gray-600 dark:text-gray-300 ">
                <div
                    className={`${loading ? " hidden " : "  "}` + " flex flex-row w-full gap-4 items-center justify-center"}>
                    <BasisCard title="coinbase" price={basis[0].coinbase} perc={0}/>
                    <BasisCard title="ftx" price={basis[0].ftx_price} perc={basis[0].ftx_basis}/>
                    <BasisCard title="binance" price={basis[0].binance_price} perc={basis[0].binance_basis}/>
                    <BasisCard title="bitmex" price={basis[0].bitmex_price} perc={basis[0].bitmex_basis}/>
                    <BasisCard title="bybit" price={basis[0].bybit_price} perc={basis[0].bybit_basis}/>
                </div>
                <div
                    className={`${loading ? " " : " hidden "}` + "flex flex-col content-start items-center px-4 text-gray-600 dark:text-gray-300 mx-auto my-auto"}>
                    <p>loading...</p>
                </div>
            </div>
        </div>
    );
}