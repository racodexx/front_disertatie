import React, { useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { AppContext } from "./AppContext";
import AdminOrdersPage from "./components/admin-app/pages/AdminOrdersPage";
import AdminProductsPage from "./components/admin-app/pages/AdminProductsPage";
import AdminFeedbacksPage from "./components/admin-app/pages/AdminFeedbacksPage";
import AdminLogin from "./components/admin-app/AdminLogin";
import HomePage from "./components/pages/HomePage";
import MenuPage from "./components/pages/MenuPage";
import ContactPage from "./components/pages/ContactPage";
import ShoppingCartPage from "./components/pages/ShoppingCartPage";

import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.css";

import "./styles/theme.css";

const routes = [
  {
    path: "/admin/login",
    component: AdminLogin,
  },
  {
    path: "/admin/orders",
    component: AdminOrdersPage,
  },
  {
    path: "/admin/products",
    component: AdminProductsPage,
  },
  {
    path: "/admin/feedbacks",
    component: AdminFeedbacksPage,
  },
  {
    path: "/client/home",
    component: HomePage,
  },
  {
    path: "/client/menu",
    component: MenuPage,
  },
  {
    path: "/client/contact",
    component: ContactPage,
  },
  {
    path: "/client/shopping-cart",
    component: ShoppingCartPage,
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
