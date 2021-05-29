import * as React from "react";
import type { IPlayer } from "@contexts/GameStateContext";
import type { IFindPlayerByIdResponse, IPlayersContext } from "./types";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";

const PlayersContext = React.createContext<IPlayersContext | undefined>(undefined);
PlayersContext.displayName = "PlayersContext";

export const PlayersContextProvider: React.FC = ({ children }) => {
  const [players, setPlayers] = React.useState<Array<IPlayer>>([]);

  /**
   * A function that finds the player with the specified ID.
   * @param playerId The id of the player being looked up.
   * @returns The player object and player index as an object.
   */
  function getPlayerById(playerId: string): IFindPlayerByIdResponse {
    const playerIndex = players.findIndex((p) => p.id.localeCompare(playerId) === 0);

    return playerIndex !== -1
      ? {
        index: playerIndex,
        player: players[playerIndex],
      }
      : undefined;
  }

  /**
   * A function that finds each player with each specified ID and returns the array of objects in the same order.
   * A batch version of `getPlayerById`
   * @param playerIds The array of player ids being looked up.
   * @returns An array containing each found player object and player index as an object.
   */
  function getPlayersByIds(playerIds: Array<string>): Array<IFindPlayerByIdResponse> {
    return playerIds.map((playerId) => getPlayerById(playerId));
  }

  /**
   * Gets the id of the player whose turn it should be next.
   * @param playerTurnId he id of the player whose turn it is.
   * @returns The id of the player whose turn it should be next.
   */
  function getNextPlayerTurnId(playerTurnId: string): string {
    const currentPlayer = getPlayerById(playerTurnId);
    if (!currentPlayer) throw new PlayerNotFoundError(playerTurnId);

    let nextPlayer: IPlayer;
    let nextPlayerIndex = currentPlayer.index; 

    do {
      nextPlayerIndex += 1;
      if (nextPlayerIndex >= players.length) nextPlayerIndex = 0;

      nextPlayer = players[nextPlayerIndex];
    } while(nextPlayer.influences.every(i => i.isDead));

    return nextPlayer.id;
  }

  /**
   * Resets all player's action response to null
   */
  function resetAllActionResponse(): void {
    setPlayers((prevPlayers) => prevPlayers.map((player) => ({
      ...player,
      actionResponse: null,
    })));
  }

  return (
    <PlayersContext.Provider
      value={{
        getNextPlayerTurnId,
        getPlayerById,
        getPlayersByIds,
        players,
        resetAllActionResponse,
        setPlayers,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
};

export function usePlayers(): IPlayersContext {
  const playersContext = React.useContext(PlayersContext);
  if (!playersContext) throw new Error("You cannot consume players context outside of a players context provider.");
  else return playersContext;
}
