import type { SetStateAction } from "react";
import type { IPlayer } from "./types";

/**
 * A function that finds the player whose turn it is.
 * @param players The array of players in the lobby.
 * @param playerTurnId The id of the player whose turn it is.
 * @returns The player object and player index as an array.
 */
export function getCurrentPlayer(players: Array<IPlayer>, playerTurnId: string): [IPlayer, number] {
  const playerIndex = players.findIndex((p) => p.id.localeCompare(playerTurnId) === 0);
  return [players[playerIndex], playerIndex];
}

/**
 * Gets the id of the player whose turn it should be next.
 * @param players The array of players in the lobby.
 * @param playerTurnId he id of the player whose turn it is.
 * @returns The id of the player whose turn it should be next.
 */
export function getNextPlayerTurnId(players: Array<IPlayer>, playerTurnId: string): string {
  const currentPlayerIndex = players.findIndex((p) => p.id.localeCompare(playerTurnId) === 0);
  return players[currentPlayerIndex === players.length - 1 ? 0 : currentPlayerIndex + 1].id;
}

export function IncomeAction(setPlayers: (value: SetStateAction<Array<IPlayer>>) => void, playerTurnId: string): void {
  setPlayers((prevPlayers) => {
    const [, currentPlayerIndex] = getCurrentPlayer(prevPlayers, playerTurnId);
    const newPlayers = [...prevPlayers];
    newPlayers[currentPlayerIndex] = {
      ...newPlayers[currentPlayerIndex],
      coins: newPlayers[currentPlayerIndex].coins + 1,
    };
    return newPlayers;
  });
}
