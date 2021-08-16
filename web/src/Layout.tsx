import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { GameStateContextProvider, useGameState } from "@contexts/GameStateContext";
import { DeckContextProvider } from "@contexts/DeckContext";
import { PlayersContextProvider } from "@contexts/PlayersContext";
import Lobby from "@pages/Lobby";
import Home from "@pages/Home";
import PlayerName from "@pages/PlayerName";
import Game from "@pages/Game";

const LobbySwitcher = (): React.ReactElement => {
  const { gameStarted } = useGameState();
  return gameStarted ? <Game /> : <Lobby />;
};

const Layout = (): React.ReactElement => (
  <Switch>
    <Route
      path="/room/:roomCode"
      render={({ match }) => (
        // if the player joining doesn't have a name set, redirect to playerName page first
        localStorage.getItem("playerName") ? (
          <DeckContextProvider>
            <PlayersContextProvider>
              <GameStateContextProvider>
                <LobbySwitcher />
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
