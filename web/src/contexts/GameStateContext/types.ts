import type { SingleOrArray, SCXML, EventData, Event } from "xstate";
import type { GameStateMachineEvent, IGameStateMachineContext } from "@GameState/GameStateMachine";

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
  id: string;
  name: string;
  coins: number;
  influences: Array<IPlayerInfluence>;
  actionResponse: IActionResponse | null;
}

export interface IGameStateContext extends IGameStateMachineContext {
  currentPlayerId: string;
  turn: string;
  handleGameEvent: (newGameState: IGameState) => void;
  handleActionResponse: (response: IActionResponse) => void;
  handleStartGame: () => void;
}

export const enum IncomingSocketActions {
  PlayersChanged = "players_changed",
  UpdatePlayerActionResponse = "updatePlayerActionResponse",
  GameStateUpdate = "gameStateUpdate",
  StartingDeck = "startingDeck",
}

export const enum OutgoingSocketActions {
  UpdateGameState = "updateGameState",
  ProposeActionResponse = "proposeActionResponse",
}
