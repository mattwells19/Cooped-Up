import express from "express";
import { createServer } from "http";
import { Socket, Server } from "socket.io";

/* Server Setup */
const app = express();
const httpServer = createServer(app);
const io: Server = require("socket.io")(httpServer);

// const io: Server = require("socket.io")(httpServer, {
//   cors: { origin: "http://localhost:8080" },
// });

/* Socket Implementation */
io.on("connection", async (socket: Socket) => {
  // can't specify auth object structure so using type assertion to make typescript happy
  const { roomCode } = socket.handshake.auth as { roomCode: string };
  if (!roomCode) throw Error("No room code was provided.");

  try {
    await socket.join(roomCode);
  } catch (e) {
    throw Error(`Cannot join room with code ${roomCode}`);
  }

  socket.on("message", (data: string) => {
    io.to(roomCode).emit("new_message", data);
  });
});

app.get("/api/checkRoom", (req, res) => {
  const { roomCode } = req.query as { roomCode: string };
  const roomExists = io.sockets.adapter.rooms.has(roomCode.toUpperCase());
  res.send(JSON.stringify(roomExists));
});

/* Ignore for now */
app.use(express.static(__dirname + "/build"));
app.get("/", (_, res) => {
  console.log(__dirname + "/build/index.html");
  res.sendFile(__dirname + "/build/index.html");
});

httpServer.listen(4000, () => console.log("Listening on port 4000"));
