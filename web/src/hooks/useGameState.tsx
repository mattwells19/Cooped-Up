import * as React from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";
import deck from "../utils/Deck";

type Influence = "Duke" | "Captain" | "Ambassador" | "Contessa" | "Assassin" | "Inquisitor";
interface IGameState {
  players: Array<IPlayer>;
  turn: string;
}

export interface IPlayerInfluence {
  type: Influence;
  isDead: boolean;
}

export interface IPlayer {
  name: string;
  coins: number;
  influences: Array<IPlayerInfluence>;
}

export default function useGameState() {
  const [players, setPlayers] = React.useState<Array<IPlayer>>([]);
  const [gameStarted, setGameStarted] = React.useState<boolean>(false);
  const [turn, setTurn] = React.useState<string>("");
  const { roomCode } = useParams<{ roomCode: string }>();
  
  const socket = React.useMemo(() => (
    io("/", {
      auth: { roomCode },
      autoConnect: false,
      reconnectionAttempts: 5,
    })
  ), [roomCode]);

  // put socket listeners in useEffect so it only registers on render
  React.useEffect(() => {
    socket.connect();

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
    return () => { socket.off(); };
  }, []);

  const handleStartGame = () => {
    deck.shuffle();

    const playerHands = players.map((player) => ({
      ...player,
      influences: deck.cards.splice(0, 2),
    }))

    setPlayers(playerHands);
    setGameStarted(true);
    setTurn(players[0].name);

    const newGameState: IGameState = {
      players: playerHands,
      turn: players[0].name,
    }
    handleGameEvent(newGameState);
  };

  function handleGameStateUpdate(newGameState: string) {
    if (!gameStarted) setGameStarted(true);
    const gameState: IGameState = JSON.parse(newGameState);
    console.log(newGameState)
    console.log(gameState)
    setPlayers(gameState.players);
    setTurn(gameState.turn);
  }

  function handleGameEvent(newGameState: IGameState) {
    socket.emit("updateGameState", JSON.stringify(newGameState));
  }

  return {
    gameStarted,
    players,
    turn,
    handleGameEvent,
    handleGameStateUpdate,
    handleStartGame,
  };
}
