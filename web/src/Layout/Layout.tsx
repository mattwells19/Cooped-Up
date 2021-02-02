import * as React from "react";
import "./Layout.css";
import {
  Redirect, Route, Switch, BrowserRouter,
} from "react-router-dom";
import Lobby from "../Lobby/Lobby";
import Home from "../Home/Home";

const Layout: React.FC = (props) => (
  <BrowserRouter>
    <Switch>
      <Route path="/room/:roomCode" component={Lobby} />
      <Route path="/" component={Home} />
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Layout;
