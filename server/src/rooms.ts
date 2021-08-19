import { IPlayer } from "./types";
import Redis from "ioredis";

let redis: Redis.Redis;

/**
 * Creates the data.json file if it does not exist.
 */
export async function init(): Promise<void> {
  redis = new Redis(process.env.REDIS_URL, { tls: { rejectUnauthorized: false } });
}

/**
 * Gets the players for the specified room if it exists
 * @param roomCode The roomCode to get the players for
 * @returns The list of players in the room or undefined if the room does not exist
 */
export async function getRoom(roomCode: string): Promise<Array<IPlayer> | undefined> {
  const data = await redis.get(roomCode);
  return data ? JSON.parse(data) : undefined;
}

/**
 * Updates the player list for the specified room
 * @param roomCode The room to update
 * @param data The updates list of players
 */
async function updateRoom(roomCode: string, data: Array<IPlayer>): Promise<void> {
  // automatically expire key after 12 hours
  redis.set(roomCode, JSON.stringify(data), "EX 43200");
}

/**
 * Removes the specified player from their room. Removes room if it empty after the player has left.
 * @param playerId The player to remove's ID
 * @returns The updated player list or null if that player was not found in a room
 */
export async function removePlayer(roomCode: string, playerId: string): Promise<Array<IPlayer> | null> {
  const players = await getRoom(roomCode);

  if (!players) throw new Error(`Room with code: ${roomCode} not found.`);

  const newPlayers = [...players].filter((p) => p.id !== playerId);

  if (newPlayers.length === 0) redis.del(roomCode);
  else await updateRoom(roomCode, newPlayers);

  return newPlayers;
}

/**
 * Adds the specified player to the specified room. Adds room if it does not exist.
 * @param roomCode The room to add the player to
 * @param player The player to add to the room
 * @returns The updated list of players
 */
export async function addPlayerToRoom(roomCode: string, player: IPlayer): Promise<Array<IPlayer>> {
  const players = (await getRoom(roomCode)) ?? [];
  const newPlayers = [...players, player];

  // automatically expire key after 12 hours
  await updateRoom(roomCode, newPlayers);

  return newPlayers;
}

/**
 * Returns whether the room exists with the given room code.
 * @param roomCode The room code to check
 * @returns boolean - whether or not the room exists
 */
export async function roomExists(roomCode: string): Promise<boolean> {
  return redis.exists(roomCode).then((res) => (res > 0 ? true : false));
}
