import { Router, Request } from "express";
import { sample as _sample } from "lodash";
import { alphabet } from "./constants";

const router = Router();

router.get("/checkRoom", (req: Request<{}, {}, {}, { roomCode: string }>, res) => {
  const { roomCode } = req.query;
  const { rooms } = req;

  const roomExists = rooms.has(roomCode.toUpperCase());
  res.send(JSON.stringify(roomExists));
});

router.get("/newRoom", (req, res) => {
  const { rooms } = req;
  let roomCode: string = "";
  do {
    roomCode = _sample(alphabet)! + _sample(alphabet) + _sample(alphabet) + _sample(alphabet);
  } while (rooms.has(roomCode));

  res.send(JSON.stringify(roomCode));
});

export default router;
