import * as React from "react";
import { Redirect, Route, Switch, BrowserRouter, RouteComponentProps } from "react-router-dom";
import Lobby from "./pages/Lobby";
import Home from "./pages/Home";
import GameStateContextProvider from "./contexts/GameStateContext/GameStateContext";

type LobbyRouteStateType = {
  newRoom: boolean | undefined;
}

type HomeRouteStateType = {
  redirect: boolean | undefined;
}

type LobbyRouteParamsType = {
  roomCode: string;
}

const Layout: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route
        path="/room/:roomCode"
        render={({ location, match }: RouteComponentProps<LobbyRouteParamsType>) => (
          <GameStateContextProvider>
            <Lobby
              newRoom={(location.state as LobbyRouteStateType)?.newRoom}
              roomCode={match.params.roomCode}
            />
          </GameStateContextProvider>
        )}
      />
      <Route
        path="/"
        render={({ location }: RouteComponentProps<LobbyRouteParamsType>) => (
          <Home
            redirect={(location.state as HomeRouteStateType)?.redirect}
          />
        )}
      />
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default Layout;
