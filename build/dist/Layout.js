import * as React from "../_snowpack/pkg/react.js";
import {
  Redirect,
  Route,
  Switch,
  BrowserRouter
} from "../_snowpack/pkg/react-router-dom.js";
import Lobby from "./pages/Lobby.js";
import Home from "./pages/Home.js";
const Layout = () => /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement(Switch, null, /* @__PURE__ */ React.createElement(Route, {
  path: "/room/:roomCode",
  component: Lobby
}), /* @__PURE__ */ React.createElement(Route, {
  path: "/",
  component: Home
}), /* @__PURE__ */ React.createElement(Route, {
  path: "*"
}, /* @__PURE__ */ React.createElement(Redirect, {
  to: "/"
}))));
export default Layout;
