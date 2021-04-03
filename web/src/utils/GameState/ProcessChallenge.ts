import type { IPlayer } from "@contexts/GameStateContext/types";
import type { IActionToastProps } from "@hooks/useActionToast";
import type { Dispatch, SetStateAction } from "react";
import { getPlayerById } from "./helperFns";
import type { ICurrentGameState } from "./types";

export default function processProposeAction(
  currentGameState: ICurrentGameState,
  playerState: [IPlayer[], Dispatch<SetStateAction<IPlayer[]>>],
): IActionToastProps | undefined {
  const { killedInfluence, challengeFailed, challengerId, performerId } = currentGameState.context;

  if (killedInfluence && challengeFailed !== undefined && challengerId && performerId) {
    const [players, setPlayers] = playerState;
    const loserId = challengeFailed ? challengerId : performerId;
    const { index: loserIndex, player: loser } = getPlayerById(players, loserId);
    if (loserIndex === -1 || !loser) throw new Error(`No player with the ID ${loserId} was found.`);

    setPlayers((prevPlayers) => {
      const newPlayers: Array<IPlayer> = [...prevPlayers].map((player) => ({ ...player, actionResponse: null }));

      const influenceToKillIndex = newPlayers[loserIndex].influences.findIndex(
        (influence) => influence.type === killedInfluence && !influence.isDead,
      );

      // victim's chosen influence to kill
      newPlayers[loserIndex] = {
        ...newPlayers[loserIndex],
        influences: newPlayers[loserIndex].influences.map((influence, index) => {
          if (index === influenceToKillIndex) {
            return {
              ...influence,
              isDead: true,
            };
          }
          return influence;
        }),
      };

      return newPlayers;
    });

    return {
      variant: "Challenge",
      lostInfluence: killedInfluence,
      victimName: loser.name,
    };
  }
  // eslint-disable-next-line consistent-return
  return undefined;
}
