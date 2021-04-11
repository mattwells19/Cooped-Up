import type { Influence, IPlayer } from "@contexts/GameStateContext";
import type { IFindPlayerByIdResponse } from "@contexts/PlayersContext";
import type { IActionToastProps } from "@hooks/useActionToast";
import { getInfluencesFromAction } from "@utils/InfluenceUtils";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";
import type { ICurrentGameState } from "./types";

interface IProcessChallengeResponse {
	actionToastProps: IActionToastProps;
	newPlayers: Array<IPlayer>;
	newDeck: Array<Influence>;
}

export default function processChallenge(
  currentGameState: ICurrentGameState,
  players: Array<IPlayer>,
  getPlayersByIds: (playerIds: Array<string>) => Array<IFindPlayerByIdResponse>,
  deck: Array<Influence>,
): IProcessChallengeResponse | undefined {
  const { action, killedInfluence, challengeFailed, challengerId, performerId } = currentGameState.context;

  if (action && killedInfluence && challengeFailed !== undefined && challengerId && performerId) {
    const loserId = challengeFailed ? challengerId : performerId;
    const winnerId = challengeFailed ? performerId : challengerId;
    const [loser, winner] = getPlayersByIds([loserId, winnerId]);

    if (!loser) throw new PlayerNotFoundError(loserId);
    if (!winner) throw new PlayerNotFoundError(winnerId);

    const newPlayers: Array<IPlayer> = [...players].map((player) => ({ ...player, actionResponse: null }));
    const newDeck: Array<Influence> = [...deck];

    const influenceToKillIndex = newPlayers[loser.index].influences.findIndex(
      (influence) => influence.type === killedInfluence && !influence.isDead,
    );

    // victim's chosen influence to kill
    newPlayers[loser.index] = {
      ...newPlayers[loser.index],
      influences: newPlayers[loser.index].influences.map((influence, index) => {
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
      const [{ type: revealedInfluence }] = winner.player.influences.filter(
        (influence) => possibleInfluences.indexOf(influence.type) !== -1,
      );

      const influenceToTradeIndex = newPlayers[winner.index].influences.findIndex(
        (influence) => influence.type === revealedInfluence && !influence.isDead,
      );

      newPlayers[winner.index] = {
        ...newPlayers[winner.index],
        influences: newPlayers[winner.index].influences.map((influence, index) => {
          if (index === influenceToTradeIndex) {
            newDeck.push(influence.type);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
        victimName: loser.player.name,
      },
      newDeck,
      newPlayers,
    };
  }
  // eslint-disable-next-line consistent-return
  return undefined;
}
