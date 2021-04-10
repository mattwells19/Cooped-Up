import type { Influence, IPlayer } from "@contexts/GameStateContext/types";
import type { IActionToastProps } from "@hooks/useActionToast";
import { getInfluencesFromAction } from "@utils/InfluenceUtils";
import { getPlayersByIds } from "./helperFns";
import type { ICurrentGameState } from "./types";

interface IProcessChallengeResponse {
  actionToastProps: IActionToastProps;
  newPlayers: Array<IPlayer>;
  newDeck: Array<Influence>;
}

export default function processChallenge(
  currentGameState: ICurrentGameState,
  players: Array<IPlayer>,
  deck: Array<Influence>,
): IProcessChallengeResponse | undefined {
  const { action, killedInfluence, challengeFailed, challengerId, performerId } = currentGameState.context;

  if (action && killedInfluence && challengeFailed !== undefined && challengerId && performerId) {
    const loserId = challengeFailed ? challengerId : performerId;
    const winnerId = challengeFailed ? performerId : challengerId;
    const [{ index: loserIndex, player: loser }, { index: winnerIndex, player: winner }] = getPlayersByIds(players, [
      loserId,
      winnerId,
    ]);

    if (loserIndex === -1 || !loser) {
      throw new Error(`No player with the ID ${loserId} was found.`);
    }
    if (winnerIndex === -1 || !winner) {
      throw new Error(`No player with the ID ${winnerId} was found.`);
    }

    const newPlayers: Array<IPlayer> = [...players].map((player) => ({ ...player, actionResponse: null }));
    const newDeck: Array<Influence> = [...deck];

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

    if (challengeFailed) {
      const possibleInfluences = getInfluencesFromAction(action);
      const [{ type: revealedInfluence }] = winner.influences.filter(
        (influence) => possibleInfluences.indexOf(influence.type) !== -1,
      );

      const influenceToTradeIndex = newPlayers[winnerIndex].influences.findIndex(
        (influence) => influence.type === revealedInfluence && !influence.isDead,
      );

      newPlayers[winnerIndex] = {
        ...newPlayers[winnerIndex],
        influences: newPlayers[winnerIndex].influences.map((influence, index) => {
          if (index === influenceToTradeIndex) {
            newDeck.push(influence.type);
            const newInfluence = newDeck.shift()!;
            return { type: newInfluence, isDead: false };
          }
          return influence;
        }),
      };
    }

    return {
      actionToastProps: {
        variant: "Challenge",
        lostInfluence: killedInfluence,
        victimName: loser.name,
      },
      newDeck,
      newPlayers,
    };
  }
  // eslint-disable-next-line consistent-return
  return undefined;
}
