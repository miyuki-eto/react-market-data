import Home from "../../pages/home";
import OpenInterest from "../../pages/openInterest";
import OpenInterestMultiple from "../../pages/openInterestMultiple";
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
        path: '/openinterestmultiple',
        exact: true,
        main: () => <OpenInterestMultiple/>
    },
    // {
    //     path: '/page2',
    //     exact: true,
    //     main: () => <Page2/>
    // }
]