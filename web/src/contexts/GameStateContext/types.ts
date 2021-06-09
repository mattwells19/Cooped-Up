import type { SingleOrArray, SCXML, EventData, Event } from "xstate";
import type { GameStateMachineEvent, IGameStateMachineContextMetadata } from "@GameState/GameStateMachine";
import type { IGameStateRoles } from "@GameState/types";

export type Influence = "Duke" | "Captain" | "Ambassador" | "Contessa" | "Assassin";

export const enum Actions {
  Assassinate = "assassinate",
  Tax = "collect tax",
  Steal = "steal",
  Exchange = "exchange Influences",
  Income = "collect income",
  Aid = "collect foreign aid",
  Coup = "coup",
  Block = "block",
}

export interface IGameState {
  event: SingleOrArray<Event<GameStateMachineEvent>> | SCXML.Event<GameStateMachineEvent>;
  eventPayload?: EventData | undefined;
  players?: Array<IPlayer>;
  deck?: Array<Influence>;
}

export interface IPlayerInfluence {
  type: Influence;
  isDead: boolean;
}

export type IActionResponse = { type: "PASS" } | { type: "CHALLENGE" } | { type: "BLOCK"; influence: Influence };

export interface IPlayer {
  index: number;
  id: string;
  name: string;
  coins: number;
  influences: Array<IPlayerInfluence>;
  actionResponse: IActionResponse | null;
}

export interface IGameStateContext extends IGameStateRoles, IGameStateMachineContextMetadata {
  currentPlayer: IPlayer;
  handleGameEvent: (newGameState: IGameState) => void;
  handleActionResponse: (response: IActionResponse) => void;
  handleStartGame: () => Promise<void>;
}

export const enum IncomingSocketActions {
  PlayersChanged = "players_changed",
  UpdatePlayerActionResponse = "updatePlayerActionResponse",
  GameStateUpdate = "gameStateUpdate",
}

export const enum OutgoingSocketActions {
  UpdateGameState = "updateGameState",
  ProposeActionResponse = "proposeActionResponse",
}
