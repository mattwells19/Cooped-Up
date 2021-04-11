/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as fs from "fs";
import { shuffle as _shuffle } from "lodash";
import { startingDeck } from "./constants";
import { IPlayer, IRoomValue } from "./types";

type RoomsData = Map<string, IRoomValue>;

/**
 * Creates the data.json file if it does not exist.
 */
export async function init(): Promise<void> {
	try {
		await fs.promises.access("data.json");
	} catch {
		await fs.promises.writeFile("data.json", JSON.stringify(new Map<string, Array<IPlayer>>()));
	}
}

/**
 * Reads the data.json file and returns it as a Map
 * @returns data as a Map
 */
async function readData(): Promise<RoomsData> {
	const dataString = await fs.promises.readFile("data.json", "utf-8");
	const parsedData = JSON.parse(dataString);

	const data = new Map<string, IRoomValue>();
	for (const roomCode in parsedData) {
		const value = parsedData[roomCode] as IRoomValue;
		data.set(roomCode, value);
	}

	return data;
}

/**
 * Overwrites the data.json file with the new data
 * @param data The new Map to write to data.json
 */
async function saveData(data: RoomsData): Promise<void> {
	// eslint-disable-next-line object-curly-newline
	const dataToWrite: Record<string, IRoomValue> = {};
	data.forEach((value, key) => {
		dataToWrite[key] = value;
	});
	await fs.promises.writeFile("data.json", JSON.stringify(dataToWrite));
}

/**
 * Gets the players for the specified room if it exists
 * @param roomCode The roomCode to get the players for
 * @returns The list of players in the room or undefined if the room does not exist
 */
export async function getRoom(roomCode: string): Promise<IRoomValue | undefined> {
	const data = await readData();
	const value = data.get(roomCode);
	return value;
}

/**
 * Removes the specified player from their room. Removes room if it empty after the player has left.
 * @param playerId The player to remove's ID
 * @returns The updated player list or null if that player was not found in a room
 */
export async function removePlayer(playerId: string): Promise<Array<IPlayer> | null> {
	const data = await readData();

	const dataKeys = Array.from(data.keys());
	const foundKey = dataKeys.find((key) => data.get(key)!.players.some((p) => p.id === playerId));
	if (!foundKey) return null;

	const { players, deck } = data.get(foundKey)!;
	const newPlayerList = [...players].filter((p) => p.id !== playerId);

	if (newPlayerList.length === 0) data.delete(foundKey);
	else data.set(foundKey, { players: newPlayerList, deck });

	await saveData(data);
	return newPlayerList;
}

/**
 * Adds the specified player to the specified room. Adds room if it does not exist.
 * @param roomCode The room to add the player to
 * @param player The player to add to the room
 * @returns The updated list of players
 */
export async function addPlayerToRoom(roomCode: string, player: IPlayer): Promise<IRoomValue> {
	const data = await readData();

	const { players, deck } = data.has(roomCode) ? data.get(roomCode)! : { players: [], deck: _shuffle(startingDeck) };

	const newValue: IRoomValue = {
		players: [...players, player],
		deck,
	};

	data.set(roomCode, newValue);
	await saveData(data);

	return newValue;
}
