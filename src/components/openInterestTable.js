import React from 'react';

export default function OpenInterestTable({ dataAll }) {

    function formatMoney(number) {
        return number.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }

    return (
        <div className="block mx-6 py-4 overflow-x-auto ">
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
                        <tr className="">
                            <td className="px-4">{token.symbol}</td>
                            <td className="px-4">{formatMoney(token.openInterest)}</td>
                            <td className="px-4">{token.openInterestAmount.toFixed(2)}</td>
                            <td className={`${token.h1OIChangePercent > 0 ? 'text-green-300' : 'text-red-300'}` + " px-4"}>{token.h1OIChangePercent.toFixed(2) + "%"}</td>
                            <td className={`${token.h4OIChangePercent > 0 ? 'text-green-300' : 'text-red-300'}` + " px-4"}>{token.h4OIChangePercent.toFixed(2) + "%"}</td>
                            <td className={`${token.h24Change > 0 ? 'text-green-300' : 'text-red-300'}` + " px-4"}>{token.h24Change.toFixed(2) + "%"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
