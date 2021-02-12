import * as React from "react";
import type { Socket } from "socket.io-client";
import deck from "../utils/Deck";

type Influence = "Duke" | "Captain" | "Ambassador" | "Contessa" | "Assassin" | "Inquisitor";
// eslint-disable-next-line max-len
type Action = "Assassinate" | "Block" | "Challenge" | "Coup" | "Exchange" | "ForeignAid" | "Income" | "Inquisite" | "Steal";

interface IGameState {
  players: Array<IPlayer>;
  turn: string;
  state: IState;
}

export interface IPlayerInfluence {
  type: Influence;
  isDead: boolean;
}

interface IPlayer {
  name: string;
  coins: number;
  influences: Array<IPlayerInfluence>;
}

interface IState {
  action: Action;
  performer: string;
  victim: string;
}

export default function useGameState(socket: Socket) {
  const [players, setPlayers] = React.useState<Array<IPlayer>>([]);
  const [gameStarted, setGameStarted] = React.useState<boolean>(false);
  const [turn, setTurn] = React.useState<string>("");
  const [state, setState] = React.useState<IState>();

  const handleStartGame = () => {
    deck.shuffle();

    setPlayers((prev) => prev.map((player) => ({
      ...player,
      influences: deck.cards.splice(0, 2),
    })));
    setGameStarted(true);
    setTurn(players[0].name);
  };

  function handleGameStateUpdate(newGameState: string) {
    const gameState: IGameState = JSON.parse(newGameState);
    setPlayers([...gameState.players]);
    setTurn(gameState.turn);
    setState({ ...gameState.state });
  }

  function handleAction(action: Action, performer: string, victim: string) {
    const newGameState: IGameState = {
      players,
      state: {
        action,
        performer,
        victim,
      },
      turn,
    };
    socket.emit("updateGameState", JSON.stringify(newGameState));
  }

  return {
    gameStarted,
    players,
    state,
    turn,
    handleAction,
    handleGameStateUpdate,
    handleStartGame,
    setPlayers,
  };
}
