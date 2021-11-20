import React from "react";
import BasicChart from "../charts/basicChart";

import {ThemeContext} from "../structure/themeContext";

export default function FtxOiView({chartData, tokenDict}) {
    const { theme } = React.useContext(ThemeContext);

    return (
        <div className="flex flex-col justify-items-center">
            <BasicChart
                chartData={chartData}
                dataLabel="ftx"
                chartHeight={420}
                chartTitle=""
                colors={(theme === 'light') ? '#735d78' : '#94dff3'}
            />
        </div>
    );
}