import * as React from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import deck from "../../utils/Deck";
import type { IGameState, IGameStateContext, IPlayer } from "./types";

export const GameStateContext = React.createContext<IGameStateContext>({
  currentPlayerId: "",
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
        playerName: localStorage.getItem("playerName")
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

  React.useEffect(() => {
    socket.off("players_changed");
    socket.on("players_changed", (playersInRoom: string[]) => {
      // only update player list if someone left once the game has started
      if (gameStarted && playersInRoom.length < players.length) {
        setPlayers((prevplayers) => (
          prevplayers.filter((player) => playersInRoom.find((p) => p === player.id))
        ));
      }
    });
  }, [gameStarted]);

  // put socket listeners in useEffect so it only registers on render
  React.useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("players_changed", (playersInRoom: string[]) => {
      setPlayers(playersInRoom.map((playerId) => ({
        id: playerId,
        coins: 2,
        influences: [],
        name: playerId, // set name to playerId until actual name is available
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
