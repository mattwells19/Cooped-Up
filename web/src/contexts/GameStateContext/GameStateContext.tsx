import * as React from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useMachine } from "@xstate/react";
import deck from "../../utils/Deck";
import { Actions, IGameState, IGameStateContext, IPlayer } from "./types";
import GameStateMachine from "../../utils/GameStateMachine";
import { getCurrentPlayer, getNextPlayerTurnId, IncomeAction } from "./Actions";
import useActionToast from "../../hooks/useActionToast";

export const GameStateContext = React.createContext<IGameStateContext | undefined>(undefined);
GameStateContext.displayName = "GameStateContext";

const GameStateContextProvider: React.FC = ({ children }) => {
  const [currentGameState, sendGameStateEvent] = useMachine(GameStateMachine);
  const [players, setPlayers] = React.useState<Array<IPlayer>>([]);
  const { roomCode } = useParams<{ roomCode: string }>();
  const actionToast = useActionToast();

  const socket = React.useMemo(() => (
    io("/", {
      auth: {
        roomCode,
        playerName: localStorage.getItem("playerName"),
      },
      autoConnect: false,
      reconnectionAttempts: 5,
    })
  ), [roomCode]);

  // Handling game state
  React.useEffect(() => {
    switch (true) {
      case currentGameState.matches("pregame"):
      case currentGameState.matches("idle"):
        break;
      case currentGameState.matches("propose_action") && currentGameState.context.action === Actions.Income:
        sendGameStateEvent("PASS"); // auto pass on income as it cannot be blocked or challenged
        break;
      case currentGameState.matches("perform_action") && currentGameState.context.action === Actions.Income: {
        IncomeAction(setPlayers, currentGameState.context.playerTurnId);
        actionToast({
          playerName: getCurrentPlayer(players, currentGameState.context.playerTurnId)[0].name,
        });
        sendGameStateEvent("COMPLETE", {
          nextPlayerTurnId: getNextPlayerTurnId(players, currentGameState.context.playerTurnId),
        });
        break;
      }
      default:
        throw new Error(`The state '${currentGameState.value}' has either not been implemented or does not exist`);
    }
  }, [currentGameState.value]);

  function handleGameStateUpdate(newGameState: IGameState) {
    sendGameStateEvent(newGameState.event, newGameState.eventPayload);
    if (newGameState.players) setPlayers(newGameState.players);
  }

  function handleGameEvent(newGameState: IGameState) {
    socket.emit("updateGameState", newGameState);
  }

  const handleStartGame = () => {
    deck.shuffle();

    const playerHands: Array<IPlayer> = players.map((player) => ({
      ...player,
      influences: deck.cards.splice(0, 2),
    }));

    setPlayers(playerHands);

    handleGameEvent({
      event: "START",
      eventPayload: {
        playerTurnId: playerHands[0].id,
      },
      players: playerHands,
    });
  };

  React.useEffect(() => {
    socket.off("players_changed");
    socket.on("players_changed", (playersInRoom: Array<Pick<IPlayer, "id" | "name">>) => {
      // only update player list if someone left once the game has started
      if (currentGameState.context.gameStarted && playersInRoom.length < players.length) {
        setPlayers((prevplayers) => (
          prevplayers.filter((player) => playersInRoom.find((p) => p.id === player.id))
        ));
      }
    });
  }, [currentGameState.context.gameStarted]);

  // put socket listeners in useEffect so it only registers on render
  React.useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("players_changed", (playersInRoom: Array<Pick<IPlayer, "id" | "name">>) => {
      setPlayers(playersInRoom.map((player) => ({
        id: player.id,
        coins: 2,
        influences: [],
        name: player.name,
      })));
    });

    socket.on("gameStateUpdate", handleGameStateUpdate);

    // perform cleanup of socket when component is removed from the DOM
    return () => { socket.offAny(); socket.disconnect(); };
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        currentPlayerId: socket.id,
        gameStarted: currentGameState.context.gameStarted,
        players,
        turn: currentGameState.context.playerTurnId,
        handleGameEvent,
        handleStartGame,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

function useGameState() {
  const gameState = React.useContext(GameStateContext);
  if (!gameState) throw Error("Tried to use game state hook outside of a GameStateProvider.");
  else return gameState;
}

export { GameStateContextProvider as default, useGameState };
