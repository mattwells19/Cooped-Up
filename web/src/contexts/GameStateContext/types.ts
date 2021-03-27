import type { SingleOrArray, SCXML, EventData, Event } from "xstate";
import type { GameStateMachineEvent, IGameStateMachineContext } from "../../utils/GameStateMachine";

export type Influence = "Duke" | "Captain" | "Ambassador" | "Contessa" | "Assassin";

export const enum Actions {
  Assassinate,
  Tax,
  Steal,
  Exchange,
  Income,
  Aid,
  Coup,
}

export interface IGameState {
  event: SingleOrArray<Event<GameStateMachineEvent>> | SCXML.Event<GameStateMachineEvent>;
  eventPayload?: EventData | undefined;
  players?: Array<IPlayer>;
}

export interface IPlayerInfluence {
  type: Influence;
  isDead: boolean;
}

export interface IPlayer {
  id: string;
  name: string;
  coins: number;
  influences: Array<IPlayerInfluence>;
}

export interface IGameStateContext extends IGameStateMachineContext {
  currentPlayerId: string;
  players: Array<IPlayer>;
  turn: string;
  handleGameEvent: (newGameState: IGameState) => void;
  handleStartGame: () => void;
}
