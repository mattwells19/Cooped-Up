import type { State, SingleOrArray, SCXML, EventData, Event } from "xstate";
import type { GameStateMachineEvent, GameStateMachineState, IGameStateMachineContext } from "./GameStateMachine";

export type ICurrentGameState = State<IGameStateMachineContext, GameStateMachineEvent, any, GameStateMachineState>;

export type ISendGameStateUpdate = (
  event: SingleOrArray<Event<GameStateMachineEvent>> | SCXML.Event<GameStateMachineEvent>,
  payload?: EventData | undefined,
) => ICurrentGameState;
