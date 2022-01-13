import React, {useState, useEffect, useRef} from "react";
import lune from "lune";
import {ThemeContext} from "../components/structure/themeContext";
import axios from "axios";
import TrabuccoTable from "../components/trabaccoTable";

export default function Trabucco() {
    const api_url = "https://www.okex.com/api/swap/v3/"
    const grabTrabuccoData = api_url + "instruments/ticker"
    const {theme} = React.useContext(ThemeContext);
    const [btc, setBtc] = useState([]);
    const [eth, setEth] = useState(
        [{
            "instrument_id": "2323",
            "last": "sadsad",
            "high_24h": "sadszad",
            "low_24h": "sadsdad",
            "volume_24h": "sada34sd",
            "volume_token_24h": "2313sd",
            "best_ask": "21dsa",
            "best_bid": "",
            "timestamp": "",
            "last_qty": "",
            "open_utc0": "",
            "open_utc8": "",
            "best_bid_size": "",
            "best_ask_size": ""

        },
            {
                "instrument_id": "2sdasdas",
                "last": "s232ad",
                "high_24h": "sad5435sdfd",
                "low_24h": "sad324324d",
                "volume_24h": "sadsfsd334sd",
                "volume_token_24h": "23sdasdasd",
                "best_ask": "211213dsa",
                "best_bid": "",
                "timestamp": "",
                "last_qty": "",
                "open_utc0": "",
                "open_utc8": "",
                "best_bid_size": "",
                "best_ask_size": ""
            }
        ]
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const trabuccoData = await getTrabuccoData();
            setBtc(trabuccoData[0]);
            setEth(trabuccoData[1]);
            setLoading(false);
            console.log(trabuccoData)
        }
        fetchData();

    }, [])

    useInterval(() => {
        const updateData = async () => {
            const trabuccoData = await getTrabuccoData();
            //setTrabucco(trabuccoData);
        }
        updateData();

    }, 5000);

    async function getTrabuccoData() {
        const data = [];
        //console.log(grabTrabuccoData)
        await axios.get("https://871bd6ba9d63.ngrok.io/trabucco").then(response => {
            data.push(response.data.results)
            //console.log(response)
        })
        return data[0];
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
    //console.log(trabucco)
    return (
        <div className="flex flex-col w-full gap-4 items-center justify-center">
            <TrabuccoTable dataAll={btc}/>
            <TrabuccoTable dataAll={eth}/>
        </div>
    );
}
