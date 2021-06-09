import type { IPlayer } from "@contexts/GameStateContext";
import type { Dispatch, SetStateAction } from "react";

export interface IPlayersContext {
  players: Array<IPlayer>;
  setPlayers: Dispatch<SetStateAction<Array<IPlayer>>>;
  getPlayerById: (playerId: string) => IPlayer | undefined;
  getPlayersByIds: (playerIds: Array<string>) => Array<IPlayer | undefined>;
  getNextPlayerTurnId: (playerTurnId: string) => string;
  resetAllActionResponse: () => void;
}
