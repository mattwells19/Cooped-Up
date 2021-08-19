import { Router, Request } from "express";
import { sample as _sample } from "lodash";
import { alphabet } from "./constants";
import * as Rooms from "./rooms";

const router = Router();

router.get("/checkRoom", (req: Request<unknown, unknown, unknown, { roomCode: string }>, res) => {
  Rooms.roomExists(req.query.roomCode.toUpperCase()).then((roomExists) => {
    res.send(JSON.stringify(roomExists));
  });
});

router.get("/newRoom", async (req, res) => {
  let roomCode = "";
  let roomAlreadyExists = false;
  do {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    roomCode = _sample(alphabet)! + _sample(alphabet) + _sample(alphabet) + _sample(alphabet);
    roomAlreadyExists = await Rooms.roomExists(roomCode);
  } while (roomAlreadyExists);

  res.send(JSON.stringify(roomCode));
});

export default router;
