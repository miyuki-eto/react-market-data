import React from 'react';

export default function TrabuccoTable({ dataAll }) {

    function formatMoney(number) {
        return number.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
    }

    return (
            <div className="flex flex-col justify-items-center w-4/5">
                <table className="text-xs justify-center px-4 text-center mt-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-md rounded-md text-center">
                    <tr className="text-lg">
                            <td>
                                ticker
                            </td>
                            <td>
                                oi bps
                            </td>   
                            <td>
                                oi
                            </td>
                            <td>
                                last
                            </td>
                            <td>
                                contract type
                            </td>
                    </tr>
                    {dataAll.map((token, index) => (
                        <tr key={token} className={`${index % 2 === 0 ? " bg-custom-gray-c " : " "}` + " items-center text-center"}>
                            <td>
                                {token.ticker + " "}
                            </td>
                            <td>
                                {token.change_oi_bps}
                            </td>   
                            <td>
                                {token.change_oi + " "}
                            </td>
                            <td>
                                {token.last + " "}
                            </td>
                            <td>
                                {token.contract_type + " "}
                            </td>
                        </tr>

                    ))}

                </table>
            </div>
    );
}
