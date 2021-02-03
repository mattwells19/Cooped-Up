const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, { cors: { origin: "http://localhost:8080" } });

io.on("connection", (socket) => {
  const { roomCode } = socket.handshake.auth;
  socket.join(roomCode);

  socket.on("message", (data) => {
    io.to(roomCode).emit("new_message", data);
  });
});

/* Ignore for now */
app.use(express.static(__dirname + '/build'));
app.get("/", (res) => {
  console.log(__dirname + "/build/index.html");
  res.sendFile(__dirname + "/build/index.html")
})

http.listen(4000, () => console.log("Listening on port 4000"))