import Home from "../../pages/home";
import OpenInterestMain from "../../pages/openInterestMain";
import Basis from "../../pages/basis";
import Moon from "../../pages/moon";

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
    {
        path: '/moon',
        exact: true,
        main: () => <Moon/>
    },
]