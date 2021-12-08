import React, {useState, useEffect, useRef} from "react";
import lune from "lune";
import {ThemeContext} from "../components/structure/themeContext";
import axios from "axios";

export default function Moon() {
    const [phase, setPhase] = useState({
        new_date: '',
        full_date: '',
        nextnew_date: ''
    });

    useEffect(() => {
        const recent_phases = lune.phase_hunt()
        setPhase(recent_phases)
    }, [])

    return (
        <div className="px-8 mx-auto">
            <div
                className="flex flex-col content-center items-center gap-2 px-4 py-4 text-gray-600 dark:text-gray-300 ">
                <div className="flex flex-row w-full gap-4 items-center justify-center">
                    <div className="flex flex-col justify-items-center w-40">
                        <div
                            className="flex flex-col content-start items-center gap-2 px-4 py-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-lg text-center">
                            <p className="text-2xl">new moon</p>
                            <p className="">
                                {new Intl.DateTimeFormat("en-GB", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit"
                                }).format(phase.new_date)}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-items-center w-40">
                        <div
                            className="flex flex-col content-start items-center gap-2 px-4 py-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-lg text-center">
                            <p className="text-2xl">full moon</p>
                            <p className="">
                                {new Intl.DateTimeFormat("en-GB", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit"
                                }).format(phase.full_date)}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-items-center w-40">
                        <div
                            className="flex flex-col content-start items-center gap-2 px-4 py-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-custom-gray-a shadow-lg rounded-lg text-center">
                            <p className="text-2xl">next new</p>
                            <p className="">
                                {new Intl.DateTimeFormat("en-GB", {
                                    year: "numeric",
                                    month: "long",
                                    day: "2-digit"
                                }).format(phase.nextnew_date)}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}