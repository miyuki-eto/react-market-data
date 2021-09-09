import React from "react";
import {Route} from "react-router-dom";

import {routes} from "./routes";
import Header from "./header";

function Main(props) {
    return (
        <div className="pb-4 h-screen w-screen overflow-y-auto">
            {routes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                >
                    <Header/>
                    <route.main />
                </Route>
            ))}
        </div>
    );
}

export default Main;