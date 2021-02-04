import express from "express";
import { createServer } from "http";
import { Socket, Server } from "socket.io";

/* Server Setup */
const app = express();
const httpServer = createServer(app);
const io: Server = require("socket.io")(httpServer, {
  cors: { origin: "http://localhost:8080" },
});

/* Socket Implementation */
io.on("connection", (socket: Socket) => {
  // can't specify auth object structure so using type assertion to make typescript happy
  const { roomCode } = socket.handshake.auth as { roomCode: string };
  if (!roomCode) throw Error("No room code was provided.");

  socket.join(roomCode);

  socket.on("message", (data: string) => {
    io.to(roomCode).emit("new_message", data);
  });
});

/* Ignore for now */
app.use(express.static(__dirname + "/build"));
app.get("/", (_, res) => {
  console.log(__dirname + "/build/index.html");
  res.sendFile(__dirname + "/build/index.html");
});

httpServer.listen(4000, () => console.log("Listening on port 4000"));
