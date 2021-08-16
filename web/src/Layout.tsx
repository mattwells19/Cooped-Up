import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { GameStateContextProvider } from "@contexts/GameStateContext";
import { DeckContextProvider } from "@contexts/DeckContext";
import { PlayersContextProvider } from "@contexts/PlayersContext";
import Lobby from "@pages/Lobby";
import Home from "@pages/Home";
import PlayerName from "@pages/PlayerName";

const Layout: React.FC = () => (
  <Switch>
    <Route
      path="/room/:roomCode"
      render={({ match }) => (
        // if the player joining doesn't have a name set, render the player name page instead
        localStorage.getItem("playerName") ? (
          <DeckContextProvider>
            <PlayersContextProvider>
              <GameStateContextProvider>
                <Lobby />
              </GameStateContextProvider>
            </PlayersContextProvider>
          </DeckContextProvider>
        ) : (
          <Redirect to={`/name?roomCode=${match.params.roomCode}`} />
        )
      )}
    />
    <Route
      path="/name"
      render={() => <PlayerName />}
    />
    <Route
      path="/"
      render={() => <Home />}
    />
    <Route path="*">
      <Redirect to="/" />
    </Route>
  </Switch>
);

export default Layout;
