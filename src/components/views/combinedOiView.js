import React from "react";
import StackedAreaChart from "../charts/stackedAreaChart";
import BasicChart from "../charts/basicChart";

import {ThemeContext} from "../structure/themeContext";

export default function CombinedOiView({stackedData, totalData, tokenDict, chartType}) {
    const {theme} = React.useContext(ThemeContext);

    return (
        <div className="flex flex-col justify-items-center">
            <div className={`${chartType === 'stacked' ? " " : " hidden "}` + " "}>
                <StackedAreaChart
                    chartData={stackedData}
                    chartHeight={420}
                    chartTitle="combined oi data"
                    tokens={['binance', 'ftx']}
                    colors={[(theme === 'light') ? '#ffafcc' : '#ffafcc', (theme === 'light') ? '#cdb4db' : '#cdb4db']}
                />
            </div>
            <div className={`${chartType === 'line' ? " " : " hidden "}` + " "}>
                <BasicChart
                    chartData={totalData}
                    chartHeight={420}
                    chartTitle=""
                    dataLabel="oi"
                />
            </div>
        </div>
    );
}