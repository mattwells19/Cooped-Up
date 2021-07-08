import type { IPlayer, IPlayerInfluence } from "@contexts/GameStateContext";
import type { State, SingleOrArray, SCXML, EventData, Event } from "xstate";
import type { GameStateMachineEvent, GameStateMachineState, IGameStateMachineContext } from "./GameStateMachine";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ICurrentGameState = State<IGameStateMachineContext, GameStateMachineEvent, any, GameStateMachineState>;

export type ISendGameStateUpdate = (
  event: SingleOrArray<Event<GameStateMachineEvent>> | SCXML.Event<GameStateMachineEvent>,
  payload?: EventData | undefined,
) => ICurrentGameState;

export interface IGameStateRoles {
  blocker: IPlayer | undefined;
  challenger: IPlayer | undefined;
  currentPlayerTurn: IPlayer | undefined;
  performer: IPlayer | undefined;
  victim: IPlayer | undefined;
  winningPlayer: IPlayer | undefined;
}

export interface IGameStateExchangeDetails {
  playerHand: Array<IPlayerInfluence>;
  deck: Array<IPlayerInfluence>;
}
