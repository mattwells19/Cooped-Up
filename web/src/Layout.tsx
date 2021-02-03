import * as React from "react";
import {
  Redirect, Route, Switch, BrowserRouter,
} from "react-router-dom";
import Lobby from "./pages/Lobby";
import Home from "./pages/Home";

const Layout: React.FC = () => (
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
