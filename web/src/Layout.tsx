import * as React from "react";
import { Redirect, Route, Switch, BrowserRouter, RouteComponentProps } from "react-router-dom";
import Lobby from "./pages/Lobby";
import Home from "./pages/Home";
import GameStateContextProvider from "./contexts/GameStateContext/GameStateContext";

type ILobbyRouteState = {
  newRoom: boolean | undefined
}

type ILobbyRouteParams = {
  roomCode: string;
}

const Layout: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route
        path="/room/:roomCode"
        render={({ location, match }: RouteComponentProps<ILobbyRouteParams>) => (
          <GameStateContextProvider>
            <Lobby
              newRoom={(location.state as ILobbyRouteState)?.newRoom}
              roomCode={match.params.roomCode}
            />
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
