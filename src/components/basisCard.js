import React from "react";

import {ThemeContext} from "./structure/themeContext";

export default function BasisCard({title, price, perc}) {
    const {theme} = React.useContext(ThemeContext);

    var currencyFormat = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <div className="flex flex-col justify-items-center w-32">
            <div
                className="flex flex-col content-start items-center gap-2 px-4 py-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-lg">
                <p className="text-lg">{title}</p>
                <p>{currencyFormat.format(price)}</p>
                <p className={`${perc > 0 ? " text-custom-accent-b " : " text-custom-accent-a "}` + " "}>
                    {parseFloat(perc).toFixed(3)+"%"}
                </p>
            </div>
        </div>
    );
}