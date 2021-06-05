import { Router, Request } from "express";
import { sample as _sample } from "lodash";
import { alphabet } from "./constants";
import * as Rooms from "./rooms";

const router = Router();

router.get("/checkRoom", (req: Request<unknown, unknown, unknown, { roomCode: string }>, res) => {
  const { roomCode } = req.query;
  const { rooms } = req;

  const roomExists = rooms.has(roomCode.toUpperCase());
  res.send(JSON.stringify(roomExists));
});

router.get("/newRoom", (req, res) => {
  const { rooms } = req;
  let roomCode = "";
  do {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    roomCode = _sample(alphabet)! + _sample(alphabet) + _sample(alphabet) + _sample(alphabet);
  } while (rooms.has(roomCode));

  res.send(JSON.stringify(roomCode));
});

router.get("/deck", async (req: Request<unknown, unknown, unknown, { roomCode: string }>, res, next) => {
  const { roomCode } = req.query;

  await Rooms.getRoomDeck(roomCode)
    .then((deck) => res.send(JSON.stringify(deck)))
    .catch((err) => next(err));
});

export default router;
