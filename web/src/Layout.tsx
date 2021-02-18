import * as React from "react";
import { Redirect, Route, Switch, BrowserRouter } from "react-router-dom";
import Lobby from "./pages/Lobby";
import Home from "./pages/Home";
import GameStateContextProvider from "./contexts/GameStateContext/GameStateContext";

interface LobbyRouteState {
  newRoom: boolean | undefined
}

const Layout: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route
        path="/room/:roomCode"
        render={(props) => (
          <GameStateContextProvider>
            <Lobby newRoom={(props.location.state as LobbyRouteState)?.newRoom} />
          </GameStateContextProvider>
        )}
      />
      <Route path="/" component={Home} />
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Layout;
