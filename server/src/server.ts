import { Application, static as staticFiles } from "express";
import { createServer } from "http";
import { Socket, Server } from "socket.io";
import path from "path";
import { sample as _sample } from "lodash";
import { alphabet } from "./constants";
import * as Rooms from "./rooms";

/* Server Setup */
const app: Application = require("express")();

const httpServer = createServer(app);
const io: Server = require("socket.io")(httpServer);

Rooms.init();

interface ISocketAuth {
  roomCode: string;
  playerName: string;
}

/* Socket Implementation */
io.on("connection", async (socket: Socket) => {
  // can't specify auth object structure so using type assertion to make typescript happy
  const { roomCode, playerName }: ISocketAuth = socket.handshake.auth as ISocketAuth;
  if (!roomCode) throw Error("No room code was provided.");

  try {
    await socket.join(roomCode);
    const playerToAdd: Rooms.IPlayer = {
      id: socket.id,
      name: playerName,
    };
    const playersInRoom = await Rooms.addPlayerToRoom(roomCode, playerToAdd);
    io.to(roomCode).emit("players_changed", playersInRoom);
  } catch (e) {
    throw Error(`Cannot join room with code ${roomCode}`);
  }

  socket.on("updateGameState", (newGameState: any) => {
    io.to(roomCode).emit("gameStateUpdate", newGameState);
  });

  socket.on("proposeActionResponse", (response: "PASS" | "CHALLENGE") => {
    io.to(roomCode).emit("updatePlayerActionResponse", {
      playerId: socket.id,
      response,
    });
  });

  socket.on("disconnect", async () => {
    const players = await Rooms.removePlayer(socket.id);
    if (players) io.to(roomCode).emit("players_changed", players);
  });
});

app.get("/api/checkRoom", (req, res) => {
  const { roomCode } = req.query as { roomCode: string };
  const roomExists = io.sockets.adapter.rooms.has(roomCode.toUpperCase());
  res.send(JSON.stringify(roomExists));
});

app.get("/api/newRoom", (req, res) => {
  let roomCode: string = "";
  do {
    roomCode = _sample(alphabet)! + _sample(alphabet) + _sample(alphabet) + _sample(alphabet);
  } while (io.sockets.adapter.rooms.has(roomCode));

  res.send(JSON.stringify(roomCode));
});

/* Used in prod to serve files */
app.use(staticFiles(path.join(__dirname, "/")));
app.get(["/", "/room/*"], (_, res) => res.sendFile(path.join(__dirname, "/index.html")));

// eslint-disable-next-line no-console
httpServer.listen(process.env.PORT || 4000, () => console.log(`Listening on port ${process.env.PORT || 4000}`));
