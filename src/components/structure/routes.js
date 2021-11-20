import Home from "../../pages/home";
import OpenInterestMain from "../../pages/openInterestMain";

export const routes = [
    {
        path: '/',
        exact: true,
        main: () => <Home/>
    },
    {
        path: '/openinterest',
        exact: true,
        main: () => <OpenInterestMain/>
    },
]