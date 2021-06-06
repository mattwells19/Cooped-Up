import { useMachine } from "@xstate/react";
import GameStateMachine from "../GameStateMachine";
import type { ICurrentGameState, ISendGameStateUpdate } from "../types";
import useProcessProposeAction from "./hooks/useProcessProposeAction";
import useProcessPerformAction from "./hooks/useProcessPerformAction";
import useProcessChallenge from "./hooks/useProcessChallenge";
import useProcessIdle from "./hooks/useProcessIdle";
import useProcessBlock from "./hooks/useProcessBlock";

export default function useCurrentGameState(): [ICurrentGameState, ISendGameStateUpdate] {
  const [currentGameState, sendGameStateEvent] = useMachine(GameStateMachine);

  useProcessIdle(currentGameState, sendGameStateEvent);
  useProcessProposeAction(currentGameState, sendGameStateEvent);
  useProcessPerformAction(currentGameState, sendGameStateEvent);
  useProcessBlock(currentGameState, sendGameStateEvent);
  useProcessChallenge(currentGameState, sendGameStateEvent);

  return [currentGameState, sendGameStateEvent];
}
