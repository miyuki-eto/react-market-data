import React from "react";
import {LineChart, XAxis, Tooltip, Line, YAxis, ResponsiveContainer, CartesianGrid} from "recharts";
import {ThemeContext} from "./structure/themeContext";

export default function OpenInterestChart({chartData}) {
    const numberFormatter = item => new Intl.NumberFormat('en').format(item);
    const { theme } = React.useContext(ThemeContext);
    const colorPrice = (theme === 'light') ? '#735d78' : '#94dff3';
    const colorOi = (theme === 'light') ? '#b392ac' : '#ffc8dd';
    return (
        <div className="flex flex-col justify-items-center w-full mt-2">
            <div className="flex flex-col text-gray-600 dark:text-gray-300 items-center w-auto">
                <h1 className="">price</h1>
                <ResponsiveContainer
                    className="m-auto"
                    width="80%"
                    height={400}
                >
                    <LineChart
                        width="80%"
                        height={400}
                        data={chartData[0]}
                        syncId="syncId1"
                        margin={{top: 10, right: 0, left: 0, bottom: 0}}
                    >
                        <CartesianGrid strokeDasharray="1" vertical={false}/>
                        <XAxis dataKey="date" hide={true}/>
                        <YAxis dataKey="price" width={150} yAxisId="right" tickFormatter={numberFormatter}
                               axisLine={false}
                               orientation="right" domain={[dataMin => (dataMin * 0.999), dataMax => (dataMax * 1.001)]}/>
                        <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                        <Line type="monotone" dataKey="price" stroke={colorPrice} yAxisId="right" dot={false}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-col text-gray-600 dark:text-gray-300 items-center w-full">
                <h1 className="">oi</h1>
                <ResponsiveContainer
                    className="m-auto"
                    width="80%"
                    height={200}>

                    <LineChart
                        width="80%"
                        height={200}
                        data={chartData[0]}
                        syncId="syncId1"
                        margin={{top: 0, right: 0, left: 0, bottom: 10}}
                    >
                        <CartesianGrid strokeDasharray="1" vertical={false}/>
                        <XAxis dataKey="date" hide={true}/>
                        <YAxis dataKey="oi" width={150} yAxisId="right" tickFormatter={numberFormatter}
                               allowDecimals={false} orientation="right" axisLine={false}
                               domain={[dataMin => (dataMin * 0.999), dataMax => (dataMax * 1.001)]}/>
                        <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                        <Line type="monotone" dataKey="oi" stroke={colorOi} yAxisId="right" dot={false}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}