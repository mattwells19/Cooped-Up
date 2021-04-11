import type { State, SingleOrArray, SCXML, EventData, Event } from "xstate";
import type { GameStateMachineEvent, GameStateMachineState, IGameStateMachineContext } from "./GameStateMachine";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ICurrentGameState = State<IGameStateMachineContext, GameStateMachineEvent, any, GameStateMachineState>;

export type ISendGameStateUpdate = (
  event: SingleOrArray<Event<GameStateMachineEvent>> | SCXML.Event<GameStateMachineEvent>,
  payload?: EventData | undefined,
) => ICurrentGameState;
