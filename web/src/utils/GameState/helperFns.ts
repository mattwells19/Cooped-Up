import type { IPlayer } from "@contexts/GameStateContext/types";

/**
 * A function that finds the player with the specified ID.
 * @param players The array of players in the lobby.
 * @param playerId The id of the player being looked up.
 * @returns The player object and player index as an object.
 */
export function getPlayerById(
	players: Array<IPlayer>,
	playerId: string,
): { player: IPlayer | undefined; index: number } {
	const playerIndex = players.findIndex((p) => p.id.localeCompare(playerId) === 0);
	return {
		player: players[playerIndex],
		index: playerIndex,
	};
}

/**
 * A function that finds each player with each specified ID and returns the array of objects in the same order.
 * A batch version of `getPlayerById`
 * @param players The array of players in the lobby.
 * @param playerIds The array of player ids being looked up.
 * @returns An array containing each found player object and player index as an object.
 */
export function getPlayersByIds(
	players: Array<IPlayer>,
	playerIds: Array<string>,
): Array<{ player: IPlayer | undefined; index: number }> {
	return playerIds.map((playerId) => getPlayerById(players, playerId));
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
