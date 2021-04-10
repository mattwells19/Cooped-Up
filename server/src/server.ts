import { Application, static as staticFiles } from "express";
import { createServer } from "http";
import { Socket, Server } from "socket.io";
import path from "path";
import * as Rooms from "./rooms";
import ApiRoutes from "./routes";
import { IncomingSocketActions, IPlayer, OutgoingSocketActions, ISocketAuth } from "./types";

/* Server Setup */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const app: Application = require("express")();

const httpServer = createServer(app);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const io: Server = require("socket.io")(httpServer);

Rooms.init();

/* Socket Implementation */
io.on(IncomingSocketActions.Connection, async (socket: Socket) => {
	// can't specify auth object structure so using type assertion to make typescript happy
	const { roomCode, playerName }: ISocketAuth = socket.handshake.auth as ISocketAuth;
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

	socket.on(IncomingSocketActions.ProposeActionResponse, (response: "PASS" | "CHALLENGE") => {
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

app.use((req, res, next) => {
	req.rooms = io.sockets.adapter.rooms;
	next();
});

app.use("/api", ApiRoutes);

/* Used in prod to serve files */
app.use(staticFiles(path.join(__dirname, "/")));
app.get(["/", "/room/*"], (_, res) => res.sendFile(path.join(__dirname, "/index.html")));

// eslint-disable-next-line no-console
httpServer.listen(process.env.PORT || 4000, () => console.log(`Listening on port ${process.env.PORT || 4000}`));
