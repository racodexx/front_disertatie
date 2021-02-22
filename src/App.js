import React, { useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { AppContext } from "./AppContext";
import AdminOrders from "./components/pages/AdminOrders";
import AdminProducts from "./components/pages/AdminProducts";
import AdminLogin from "./components/admin-app/AdminLogin";

import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";

import "./styles/theme.css";
const routes = [
  {
    path: "/admin/orders",
    component: AdminOrders,
  },
  {
    path: "/admin/products",
    component: AdminProducts,
  },
  {
    path: "/admin/login",
    component: AdminLogin,
  },
];

const App = () => {
  const [appState, setAppState] = useState({});
  return (
    <AppContext.Provider value={{ appState, setAppState }}>
      <Router>
        <Switch>
          {routes.map((route, key) => {
            return (
              <Route
                key={key}
                path={route.path}
                component={route.component}
                exact
              ></Route>
            );
          })}
        </Switch>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
