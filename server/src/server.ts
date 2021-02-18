import { Application, static as staticFiles } from "express";
import { createServer } from "http";
import { Socket, Server } from "socket.io";
import path from "path";
import { sample as _sample } from "lodash";
import { alphabet } from "./constants";

/* Server Setup */
const app: Application = require("express")();

const httpServer = createServer(app);
const io: Server = require("socket.io")(httpServer);

/* Socket Implementation */
io.on("connection", async (socket: Socket) => {
  // can't specify auth object structure so using type assertion to make typescript happy
  const { roomCode } = socket.handshake.auth as { roomCode: string };
  if (!roomCode) throw Error("No room code was provided.");

  try {
    await socket.join(roomCode);
    const playersInRoom = Array.from(io.sockets.adapter.rooms.get(roomCode) || new Set());
    io.to(roomCode).emit("players_changed", playersInRoom);
  } catch (e) {
    throw Error(`Cannot join room with code ${roomCode}`);
  }

  socket.on("updateGameState", (newGameState: any) => {
    io.to(roomCode).emit("gameStateUpdate", newGameState);
  });

  socket.on("disconnect", () => {
    const playersInRoom = Array.from(io.sockets.adapter.rooms.get(roomCode) || new Set());
    io.to(roomCode).emit("players_changed", playersInRoom);
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
