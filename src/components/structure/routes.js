import Home from "../../pages/home";
import OpenInterest from "../../pages/openInterest";
import OpenInterestMultiple from "../../pages/openInterestMultiple";
import OpenInterestAgg from "../../pages/openInterestAgg";
import OpenInterestAll from "../../pages/openInterestAll";
import OpenInterestFtx from "../../pages/openInterestFtx";
// import Page2 from "../pages/page2";

export const routes = [
    {
        path: '/',
        exact: true,
        main: () => <Home/>
    },
    {
        path: '/openinterest',
        exact: true,
        main: () => <OpenInterest/>
    },
    {
        path: '/openinterestall',
        exact: true,
        main: () => <OpenInterestAll/>
    },
    {
        path: '/openinterestftx',
        exact: true,
        main: () => <OpenInterestFtx/>
    },
    // {
    //     path: '/page2',
    //     exact: true,
    //     main: () => <Page2/>
    // }
]