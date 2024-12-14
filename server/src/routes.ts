import { Router, Request } from "express";
import { sample as _sample } from "lodash";
import { alphabet } from "./constants";
import Rooms from "./rooms";

const router = Router();

router.get("/checkRoom", async (req: Request<unknown, unknown, unknown, { roomCode: string }>, res) => {
  const roomExists = Rooms.roomExists(req.query.roomCode.toUpperCase());
  res.send(JSON.stringify(roomExists));
});

router.get("/newRoom", (req, res) => {
  let roomCode = "";
  let roomAlreadyExists = false;

  try {
    do {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      roomCode = _sample(alphabet)! + _sample(alphabet) + _sample(alphabet) + _sample(alphabet);
      roomAlreadyExists = Rooms.roomExists(roomCode);
    } while (roomAlreadyExists);
  } catch (e) {
    throw new Error(`Could not create new room: ${e}`);
  }

  res.send(JSON.stringify(roomCode));
});

export default router;
