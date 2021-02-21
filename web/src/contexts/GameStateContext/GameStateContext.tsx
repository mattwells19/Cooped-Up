import * as React from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import deck from "../../utils/Deck";
import type { IGameState, IGameStateContext, IPlayer } from "./types";

export const GameStateContext = React.createContext<IGameStateContext>({
  currentPlayerName: "",
  gameStarted: false,
  players: [],
  turn: "",
  handleGameEvent: () => null,
  handleGameStateUpdate: () => null,
  handleStartGame: () => null,
});
GameStateContext.displayName = "GameStateContext";

const GameStateContextProvider: React.FC = ({ children }) => {
  const [players, setPlayers] = React.useState<Array<IPlayer>>([]);
  const [gameStarted, setGameStarted] = React.useState<boolean>(false);
  const [turn, setTurn] = React.useState<string>("");
  const { roomCode } = useParams<{ roomCode: string }>();

  const socket = React.useMemo(() => (
    io("/", {
      auth: {
        roomCode,
      },
      autoConnect: false,
      reconnectionAttempts: 5,
    })
  ), [roomCode]);

  function handleGameStateUpdate(newGameState: IGameState) {
    setGameStarted(newGameState.gameStarted);
    setPlayers(newGameState.players);
    setTurn(newGameState.turn);
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
    setGameStarted(true);
    setTurn(players[0].name);

    const newGameState: IGameState = {
      gameStarted: true,
      players: playerHands,
      turn: players[0].name,
    };
    handleGameEvent(newGameState);
  };

  // put socket listeners in useEffect so it only registers on render
  React.useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("players_changed", (playersInRoom: string[]) => {
      if (!gameStarted) {
        setPlayers(playersInRoom.map((player) => ({
          coins: 2,
          influences: [],
          name: player,
        })));
      }
    });

    socket.on("gameStateUpdate", handleGameStateUpdate);

    // perform cleanup of socket when component is removed from the DOM
    return () => { socket.offAny(); socket.disconnect(); };
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        currentPlayerName: socket.id,
        gameStarted,
        players,
        turn,
        handleGameEvent,
        handleGameStateUpdate,
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
