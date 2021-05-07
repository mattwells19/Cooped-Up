import { Server, Socket } from "socket.io";
import * as Rooms from "./rooms";
import { IncomingSocketActions, IPlayer, OutgoingSocketActions, ISocketAuth } from "./types";

export default function initializeSocketEvents(io: Server): void {
  io.on(IncomingSocketActions.Connection, async (socket: Socket) => {
    // can't specify auth object structure so using type assertion to make typescript happy
    const { roomCode, playerName } = socket.handshake.auth as ISocketAuth;
    if (!roomCode) throw Error("No room code was provided.");

    try {
      await socket.join(roomCode);
      const playerToAdd: IPlayer = {
        id: socket.id,
        name: playerName,
      };
      const { players: playersInRoom, deck } = await Rooms.addPlayerToRoom(roomCode, playerToAdd);
      io.to(roomCode).emit(OutgoingSocketActions.PlayersChanged, playersInRoom);
      socket.emit(OutgoingSocketActions.StartingDeck, deck);
    } catch (e) {
      throw Error(`Cannot join room with code ${roomCode}`);
    }

    socket.on(IncomingSocketActions.UpdateGameState, async (newGameState: unknown) => {
      io.to(roomCode).emit(OutgoingSocketActions.GameStateUpdate, newGameState);
    });

    socket.on(IncomingSocketActions.ProposeActionResponse, (response: "PASS" | "CHALLENGE" | "BLOCK") => {
      io.to(roomCode).emit(OutgoingSocketActions.UpdatePlayerActionResponse, {
        playerId: socket.id,
        response,
      });
    });

    socket.on(IncomingSocketActions.Disconnect, async () => {
      const players = await Rooms.removePlayer(socket.id);
      if (players) io.to(roomCode).emit(OutgoingSocketActions.PlayersChanged, players);
    });
  });
}
