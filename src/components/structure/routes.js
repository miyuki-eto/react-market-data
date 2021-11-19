import Home from "../../pages/home";
import OpenInterestWeighted from "../../pages/openInterestWeighted";
import OpenInterestBinance from "../../pages/openInterestBinance";
import OpenInterestFtx from "../../pages/openInterestFtx";
// import Page2 from "../pages/page2";

export const routes = [
    {
        path: '/',
        exact: true,
        main: () => <Home/>
    },
    {
        path: '/openinterestweighted',
        exact: true,
        main: () => <OpenInterestWeighted/>
    },
    {
        path: '/openinterestbinance',
        exact: true,
        main: () => <OpenInterestBinance/>
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