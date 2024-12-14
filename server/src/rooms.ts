import { IPlayer } from "./types";

class Rooms {
  private rooms: Map<string, Array<IPlayer>>;

  constructor() {
    this.rooms = new Map();
  }

  /**
   * Gets the players for the specified room if it exists
   * @param roomCode The roomCode to get the players for
   * @returns The list of players in the room or undefined if the room does not exist
   */
  getRoom(roomCode: string): Array<IPlayer> | undefined {
    return this.rooms.get(roomCode);
  }

  /**
   * Updates the player list for the specified room
   * @param roomCode The room to update
   * @param data The updates list of players
   */
  updateRoom(roomCode: string, data: Array<IPlayer>): void {
    this.rooms.set(roomCode, data);
  }

  /**
   * Removes the specified player from their room. Removes room if it empty after the player has left.
   * @param playerId The player to remove's ID
   * @returns The updated player list or null if that player was not found in a room
   */
  removePlayer(roomCode: string, playerId: string): Array<IPlayer> | null {
    const players = this.getRoom(roomCode);

    if (!players) throw new Error(`Room with code: ${roomCode} not found.`);

    const newPlayers = [...players].filter((p) => p.id !== playerId);

    if (newPlayers.length === 0) this.rooms.delete(roomCode);
    else this.updateRoom(roomCode, newPlayers);

    return newPlayers;
  }

  /**
   * Adds the specified player to the specified room. Adds room if it does not exist.
   * @param roomCode The room to add the player to
   * @param player The player to add to the room
   * @returns The updated list of players
   */
  addPlayerToRoom(roomCode: string, player: IPlayer): Array<IPlayer> {
    const players = this.getRoom(roomCode) ?? [];
    const newPlayers = [...players, player];

    this.updateRoom(roomCode, newPlayers);

    return newPlayers;
  }

  /**
   * Returns whether the room exists with the given room code.
   * @param roomCode The room code to check
   * @returns boolean - whether or not the room exists
   */
  roomExists(roomCode: string): boolean {
    return this.rooms.has(roomCode);
  }
}

export default new Rooms();
