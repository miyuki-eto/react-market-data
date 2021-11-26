import Home from "../../pages/home";
import OpenInterestMain from "../../pages/openInterestMain";
import Basis from "../../pages/basis";

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
    {
        path: '/basis',
        exact: true,
        main: () => <Basis/>
    },
]