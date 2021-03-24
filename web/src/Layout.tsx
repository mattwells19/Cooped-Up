import * as React from "react";
import { Redirect, Route, Switch, BrowserRouter, RouteComponentProps } from "react-router-dom";
import Lobby from "./pages/Lobby";
import Home from "./pages/Home";
import PlayerName from "./pages/PlayerName";
import GameStateContextProvider from "./contexts/GameStateContext/GameStateContext";

type LobbyRouteStateType = {
  newRoom: boolean | undefined;
}

type HomeRouteStateType = {
  invalidRoomCode: boolean | undefined;
}

type LobbyRouteParamsType = {
  roomCode: string;
}

const Layout: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route
        path="/room/:roomCode"
        render={({ location, match }: RouteComponentProps<LobbyRouteParamsType>) => {
          // if the player joining doesn't have a name set, render the player name page instead
          if (localStorage.getItem("playerName")) {
            return (
              <GameStateContextProvider>
                <Lobby
                  newRoom={(location.state as LobbyRouteStateType)?.newRoom}
                  roomCode={match.params.roomCode}
                />
              </GameStateContextProvider>
            );
          }
          return (
            <PlayerName
              newRoom={(location.state as LobbyRouteStateType)?.newRoom}
              roomCode={match.params.roomCode}
            />
          );
        }}
      />
      <Route
        path="/"
        render={({ location }) => (
          <Home
            invalidRoomCode={(location.state as HomeRouteStateType)?.invalidRoomCode}
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
