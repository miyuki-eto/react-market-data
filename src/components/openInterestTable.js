import React from 'react';
import OpenInterestRow from "./openInterestRow"

export default function OpenInterestTable({ dataAll, dataEx }) {

    return (
        <div className="block mx-6 overflow-x-auto ">
            <table className="w-full table text-right">
                <thead>
                <tr className="">
                    <th className="px-4">Symbol</th>
                    <th className="px-4">OI (USD)</th>
                    <th className="px-4">OI (Token)</th>
                    <th className="px-4">1hr Change</th>
                    <th className="px-4">4hr Change</th>
                    <th className="px-4">24hr Change</th>
                </tr>
                </thead>
                <tbody>
                    {dataAll.map((token, index) => (
                        <OpenInterestRow token={token} data={dataEx.filter(row => row.symbol === token.symbol)}/>

                    ))}
                </tbody>
            </table>
        </div>
    );
}
