import React, {useState, useEffect} from "react";
import BasisCard from "../components/basisCard";

import {ThemeContext} from "../components/structure/themeContext";
import axios from "axios";

export default function Basis({chartData, tokenDict}) {
    const { theme } = React.useContext(ThemeContext);

    const [coinbase, setCoinbase] = useState();
    const [ftx, setFtx] = useState();
    const [binance, setBinance] = useState();
    const [bybit, setBybit] = useState();
    const [bitmex, setBitmex] = useState();

    useEffect(() => {
        const fetchData = async () => {
            // setBasisData({})
            await getCoinbaseData();
            await getFtxData();
            await getBinanceData();
            await getBitmexData();
            await getBybitData();
        }
        fetchData();
    }, [])


    async function getCoinbaseData() {
        await axios.get(
            "https://api.coinbase.com/v2/prices/BTC-USD/spot"
        )
            .then(response => {
                setCoinbase(parseFloat(response.data.data.amount));
            }
        )
    }


    async function getFtxData() {
        await axios.get(
            "https://ftx.com/api/futures/btc-perp"
        )
            .then(response => {
                setFtx(parseFloat(response.data.data.amount));
                }
            )
    }

    async function getBinanceData() {
        await axios.get(
            "https://fapi.binance.com/fapi/v1/premiumIndex?symbol=BTCUSDT"
        )
            .then(response => {
                    setBinance(parseFloat(response.data.markPrice));
                }
            )
    }

    async function getBybitData() {
        await axios.get(
            "https://api.bybit.com/v2/public/tickers?symbol=BTCUSD"
        )
            .then(response => {
                console.log(response)
                    setBybit(parseFloat(response.data.markPrice));
                }
            )
    }

    async function getBitmexData() {
        await axios.get(
            "https://www.bitmex.com/api/v1/instrument?symbol=XBT%3Aperpetual&count=100&reverse=true"
        )
            .then(response => {
                    console.log(response)
                    setBitmex(parseFloat(response.data.markPrice));
                }
            )
    }

    return (
        <div className="px-8 mx-auto">
            <div
                className="flex flex-col content-center items-center gap-2 px-4 py-4 text-gray-600 dark:text-gray-300 ">
                <div className="flex flex-row w-full gap-4 items-center justify-center">
                    <BasisCard title="coinbase" price={coinbase}    perc={0}/>
                    <BasisCard title="ftx"      price={ftx}         perc={((ftx / coinbase) - 1) * 100}/>
                    <BasisCard title="binance"  price={binance}     perc={((binance / coinbase) - 1) * 100}/>
                    <BasisCard title="bitmex"   price={bitmex}      perc={((bitmex / coinbase) - 1) * 100}/>
                    <BasisCard title="bybit"    price={bybit}       perc={((bybit / coinbase) - 1) * 100}/>
                </div>
            </div>
        </div>
    );
}