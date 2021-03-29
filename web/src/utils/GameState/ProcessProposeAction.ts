import { Actions, IPlayer } from "@contexts/GameStateContext/types";
import type { Dispatch, SetStateAction } from "react";
import { getPlayerById } from "./Actions";
import type { ICurrentGameState, ISendGameStateUpdate } from "./types";

export default function processProposeAction(
  currentGameState: ICurrentGameState,
  playerState: [IPlayer[], Dispatch<SetStateAction<IPlayer[]>>],
  sendGameStateEvent: ISendGameStateUpdate,
) {
  const [players, setPlayers] = playerState;

  switch (currentGameState.context.action) {
    case Actions.Coup: {
      const victim = getPlayerById(players, currentGameState.context.victimId).player;
      if (!victim) throw new Error(`No player was found with the id ${currentGameState.context.victimId}.`);

      // if victim only has one influence skip the selection step and eliminate the single influence
      const victimAliveInfluences = victim.influences.filter((i) => !i.isDead);
      if (victimAliveInfluences.length < 2) {
        sendGameStateEvent("PASS", {
          killedInfluence: victimAliveInfluences[0].type,
        });
      }

      break;
    }
    case Actions.Income:
      sendGameStateEvent("PASS"); // auto pass on income as it cannot be blocked or challenged
      break;
    case Actions.Tax:
      // the performer isn't going to challenge themselves so automatically set their response to PASS
      setPlayers((prevPlayers) => {
        const { index: performerIndex } = getPlayerById(prevPlayers, currentGameState.context.performerId);
        const newPlayers = [...prevPlayers];
        newPlayers[performerIndex] = {
          ...newPlayers[performerIndex],
          actionResponse: "PASS",
        };
        return newPlayers;
      });
      break;
    default:
      throw new Error(`The action ${currentGameState.context.action} either does not exist or is not implemented yet.`);
  }
}
