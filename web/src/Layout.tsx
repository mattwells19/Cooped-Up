import * as React from "react";
import { Redirect, Route, Switch, BrowserRouter } from "react-router-dom";
import Lobby from "./pages/Lobby";
import Home from "./pages/Home";
import GameStateContextProvider from "./contexts/GameStateContext/GameStateContext";

interface ILobbyRouteState {
  newRoom: boolean | undefined
}

interface ILobbyRouteParams {
  roomCode: string;
}

const Layout: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route
        path="/room/:roomCode"
        render={(props) => (
          <GameStateContextProvider>
            <Lobby
              newRoom={(props.location.state as ILobbyRouteState)?.newRoom}
              roomCode={(props.match.params as ILobbyRouteParams).roomCode}
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
