/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import * as fs from "fs";

export interface IPlayer {
  id: string;
  name: string;
}

type RoomsData = Map<string, Array<IPlayer>>;

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

  const data = new Map<string, Array<IPlayer>>();
  for (const roomCode in parsedData) {
    const players = parsedData[roomCode] as Array<IPlayer>;
    data.set(roomCode, players);
  }

  return data;
}

/**
 * Overwrites the data.json file with the new data
 * @param data The new Map to write to data.json
 */
async function saveData(data: RoomsData): Promise<void> {
  // eslint-disable-next-line object-curly-newline
  const dataToWrite: Record<string, IPlayer[]> = {};
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
export async function getRoom(roomCode: string): Promise<Array<IPlayer> | undefined> {
  const data = await readData();
  const players = data.get(roomCode);
  return players;
}

/**
 * Removes the specified player from their room. Removes room if it empty after the player has left.
 * @param playerId The player to remove's ID
 * @returns The updated player list or null if that player was not found in a room
 */
export async function removePlayer(playerId: string): Promise<Array<IPlayer> | null> {
  const data = await readData();

  const dataKeys = Array.from(data.keys());
  const foundKey = dataKeys.find((key) => data.get(key)!.some((p) => p.id === playerId));
  if (!foundKey) return null;

  const players = data.get(foundKey)!;
  const newPlayerList = [...players].filter((p) => p.id !== playerId);

  if (newPlayerList.length === 0) data.delete(foundKey);
  else data.set(foundKey, newPlayerList);

  await saveData(data);
  return newPlayerList;
}

/**
 * Adds the specified player to the specified room. Adds room if it does not exist.
 * @param roomCode The room to add the player to
 * @param player The player to add to the room
 * @returns The updated list of players
 */
export async function addPlayerToRoom(roomCode: string, player: IPlayer): Promise<Array<IPlayer>> {
  const data = await readData();

  const players = (data.has(roomCode) ? data.get(roomCode) : [])!;

  const newPlayers = [...players];
  newPlayers.push(player);

  data.set(roomCode, newPlayers);
  await saveData(data);

  return newPlayers;
}
