import { useMachine } from "@xstate/react";
import GameStateMachine from "../GameStateMachine";
import type { ICurrentGameState, IGameStateRoles, ISendGameStateUpdate } from "../types";
import useProcessProposeAction from "./hooks/useProcessProposeAction";
import useProcessPerformAction from "./hooks/useProcessPerformAction";
import useProcessChallenge from "./hooks/useProcessChallenge";
import useProcessIdle from "./hooks/useProcessIdle";
import useProcessBlock from "./hooks/useProcessBlock";
import { usePlayers } from "@contexts/PlayersContext";

export default function useCurrentGameState(): [ICurrentGameState, ISendGameStateUpdate, IGameStateRoles] {
  const [currentGameState, sendGameStateEvent] = useMachine(GameStateMachine);
  const { getPlayersByIds } = usePlayers();

  const [blocker, challenger, currentPlayerTurn, performer, victim, winningPlayer] = getPlayersByIds([
    currentGameState.context.blockerId,
    currentGameState.context.challengerId,
    currentGameState.context.playerTurnId,
    currentGameState.context.performerId,
    currentGameState.context.victimId,
    currentGameState.context.winningPlayerId,
  ]);

  const gameStateRoles: IGameStateRoles = {
    blocker,
    challenger,
    currentPlayerTurn: currentPlayerTurn ?? {
      actionResponse: null,
      coins: 0,
      id: "",
      index: -1,
      influences: [],
      name: "DefaultEmptyPlayer",
    },
    performer,
    victim,
    winningPlayer,
  };

  useProcessIdle(currentGameState, sendGameStateEvent, gameStateRoles);
  useProcessProposeAction(currentGameState, sendGameStateEvent, gameStateRoles);
  useProcessPerformAction(currentGameState, sendGameStateEvent, gameStateRoles);
  useProcessBlock(currentGameState, sendGameStateEvent, gameStateRoles);
  useProcessChallenge(currentGameState, sendGameStateEvent, gameStateRoles);

  return [currentGameState, sendGameStateEvent, gameStateRoles];
}
