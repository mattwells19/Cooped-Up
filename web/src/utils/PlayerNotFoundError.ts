export default class PlayerNotFoundError extends Error {
	constructor(playerId: string) {
		super(`No player found with the id ${playerId}.`);
		this.name = "PlayerNotFoundError";
	}
}
