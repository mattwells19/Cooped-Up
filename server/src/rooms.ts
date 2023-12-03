import { IPlayer } from "./types";
import Redis from "ioredis";

class Rooms {
  private redis: Redis;

  constructor() {
    const REDIS_URL = process.env.REDIS_URL;
    if (!REDIS_URL) {
      throw new Error("No redis connection string found");
    }
    this.redis = new Redis(REDIS_URL, { family: 6 });
  }

  disconnect(): void {
    this.redis.disconnect();
  }

  /**
   * Gets the players for the specified room if it exists
   * @param roomCode The roomCode to get the players for
   * @returns The list of players in the room or undefined if the room does not exist
   */
  async getRoom(roomCode: string): Promise<Array<IPlayer> | undefined> {
    const data = await this.redis.get(roomCode);
    return data ? JSON.parse(data) : undefined;
  }

  /**
   * Updates the player list for the specified room
   * @param roomCode The room to update
   * @param data The updates list of players
   */
  async updateRoom(roomCode: string, data: Array<IPlayer>): Promise<void> {
    // automatically expire key after 12 hours
    this.redis.set(roomCode, JSON.stringify(data), "EX", 43200);
  }

  /**
   * Removes the specified player from their room. Removes room if it empty after the player has left.
   * @param playerId The player to remove's ID
   * @returns The updated player list or null if that player was not found in a room
   */
  async removePlayer(roomCode: string, playerId: string): Promise<Array<IPlayer> | null> {
    const players = await this.getRoom(roomCode);

    if (!players) throw new Error(`Room with code: ${roomCode} not found.`);

    const newPlayers = [...players].filter((p) => p.id !== playerId);

    if (newPlayers.length === 0) this.redis.del(roomCode);
    else await this.updateRoom(roomCode, newPlayers);

    return newPlayers;
  }

  /**
   * Adds the specified player to the specified room. Adds room if it does not exist.
   * @param roomCode The room to add the player to
   * @param player The player to add to the room
   * @returns The updated list of players
   */
  async addPlayerToRoom(roomCode: string, player: IPlayer): Promise<Array<IPlayer>> {
    const players = (await this.getRoom(roomCode)) ?? [];
    const newPlayers = [...players, player];

    await this.updateRoom(roomCode, newPlayers);

    return newPlayers;
  }

  /**
   * Returns whether the room exists with the given room code.
   * @param roomCode The room code to check
   * @returns boolean - whether or not the room exists
   */
  async roomExists(roomCode: string): Promise<boolean> {
    return this.redis.exists(roomCode).then((res) => (res > 0 ? true : false));
  }
}

export default new Rooms();
