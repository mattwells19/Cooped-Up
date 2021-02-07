"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const http_1 = require("http");
/* Server Setup */
const app = require("express")();
const httpServer = http_1.createServer(app);
const io = require("socket.io")(httpServer);
/* Socket Implementation */
io.on("connection", async (socket) => {
    // can't specify auth object structure so using type assertion to make typescript happy
    const { roomCode } = socket.handshake.auth;
    if (!roomCode)
        throw Error("No room code was provided.");
    try {
        await socket.join(roomCode);
    }
    catch (e) {
        throw Error(`Cannot join room with code ${roomCode}`);
    }
    socket.on("message", (data) => {
        io.to(roomCode).emit("new_message", data);
    });
});
app.get("/api/checkRoom", (req, res) => {
    const { roomCode } = req.query;
    const roomExists = io.sockets.adapter.rooms.has(roomCode.toUpperCase());
    res.send(JSON.stringify(roomExists));
});
/* Ignore for now */
app.use(express.static(__dirname + "/"));
app.get(["/", "/room/*"], (_, res) => res.sendFile(__dirname + "/index.html"));
httpServer.listen(process.env.PORT || 4000, () => console.log("Listening on port 4000"));
