import { Application, static as staticFiles } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import ApiRoutes from "./routes";
import initializeSocketEvents from "./socket";

/* Server Setup */
const app: Application = require("express")();
const httpServer = createServer(app);
const io: Server = require("socket.io")(httpServer);

app.use("/api", ApiRoutes);

/* Used in prod to serve files */
app.use(staticFiles(path.join(__dirname, "/")));
app.get(["/", "/room/*", "/name"], (_, res) => res.sendFile(path.join(__dirname, "/index.html")));

initializeSocketEvents(io);
httpServer.listen(process.env.PORT ?? 4000, () => console.info(`Listening on port ${process.env.PORT ?? 4000}`));
