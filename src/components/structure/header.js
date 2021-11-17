import React from 'react';
import Toggle from "./themeToggle";
import {Link} from "react-router-dom";
import {MdShowChart} from 'react-icons/md';

function Header() {
    return (
        <div
            className="mb-8 flex flex-row w-full px-8 py-2 items-center justify-between shadow bg-white dark:bg-custom-gray-a">
            <Link to="/">
                <MdShowChart
                    className="text-gray-500 dark:text-gray-400 text-4xl cursor-pointer"
                />
            </Link>
            <div className="flex flex-row space-between gap-4 text-gray-600 dark:text-gray-300">
                <ul className="flex flex-row text-xl text-center w-full">
                    <Link to="/">
                        <li className="rounded-lg px-2 py-2">
                            home
                        </li>
                    </Link>
                    <Link to="/openinterest">
                        <li className="rounded-lg px-2 py-2">
                            weighted oi
                        </li>
                    </Link>
                    <Link to="/openinterestall">
                        <li className="rounded-lg px-2 py-2">
                            binance oi
                        </li>
                    </Link>
                    <Link to="/openinterestftx">
                        <li className="rounded-lg px-2 py-2">
                            ftx oi
                        </li>
                    </Link>
                </ul>
            </div>
            <div className="">
                <Toggle/>
            </div>
        </div>
    );
};

export default Header;