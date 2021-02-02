const http = require("http").createServer();
const io = require("socket.io")(http, { cors: { origin: "http://localhost:8080" } });

io.on("connection", (socket) => {
  console.log("connected");
  console.log(socket.handshake.auth.roomCode);

  socket.on("message", (data) => {
    io.emit("new_message", data);
  });
});

http.listen(4000, () => console.log("Listening on port 4000"))