export const enum Influence {
  Duke = "Duke",
  Captain = "Captain",
  Ambassador = "Ambassador",
  Contessa = "Contessa",
  Assassin = "Assassin",
}

export const enum IncomingSocketActions {
  Connection = "connection",
  UpdateGameState = "updateGameState",
  ProposeActionResponse = "proposeActionResponse",
  Disconnect = "disconnect",
}

export const enum OutgoingSocketActions {
  PlayersChanged = "players_changed",
  GameStateUpdate = "gameStateUpdate",
  UpdatePlayerActionResponse = "updatePlayerActionResponse",
}

export interface IPlayer {
  id: string;
  name: string;
}

export interface ISocketAuth {
  roomCode: string;
  playerName: string;
}

export interface IRoomValue {
  players: Array<IPlayer>;
  deck: Array<Influence>;
}

export type IActionResponse = { type: "PASS" } | { type: "CHALLENGE" } | { type: "BLOCK"; influence: Influence };
