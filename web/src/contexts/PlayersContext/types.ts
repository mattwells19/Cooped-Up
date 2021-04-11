import type { IPlayer } from "@contexts/GameStateContext";
import type { Dispatch, SetStateAction } from "react";

export interface IPlayersContext {
  players: Array<IPlayer>;
  setPlayers: Dispatch<SetStateAction<Array<IPlayer>>>;
  getPlayerById: (playerId: string) => IFindPlayerByIdResponse;
  getPlayersByIds: (playerIds: Array<string>) => Array<IFindPlayerByIdResponse>;
  getNextPlayerTurnId: (playerTurnId: string) => string;
}

export type IFindPlayerByIdResponse =
  | {
      player: IPlayer;
      index: number;
    }
  | undefined;
