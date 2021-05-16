import type { Influence, IPlayer } from "@contexts/GameStateContext";
import type { IFindPlayerByIdResponse } from "@contexts/PlayersContext";
import type { IActionToastProps } from "@hooks/useActionToast";
import { ActionDetails } from "@utils/ActionUtils";
import { getInfluenceFromAction } from "@utils/InfluenceUtils";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";
import type { ICurrentGameState } from "./types";

interface IProcessChallengeResponse {
  actionToastProps: IActionToastProps;
  newPlayers: Array<IPlayer>;
  newDeck: Array<Influence>;
}

export function processChallenge(
  currentGameState: ICurrentGameState,
  players: Array<IPlayer>,
  getPlayersByIds: (playerIds: Array<string>) => Array<IFindPlayerByIdResponse>,
  deck: Array<Influence>,
): IProcessChallengeResponse | undefined {
  const gameStateContext = currentGameState.context;

  if (gameStateContext.challengeFailed !== undefined) {
    const [performer, challenger] = getPlayersByIds([gameStateContext.performerId, gameStateContext.challengerId]);

    if (!performer) throw new PlayerNotFoundError(gameStateContext.blockerId);
    if (!challenger) throw new PlayerNotFoundError(gameStateContext.challengerId);

    const loser = gameStateContext.challengeFailed ? challenger : performer;
    const winner = gameStateContext.challengeFailed ? performer : challenger;

    const newPlayers: Array<IPlayer> = players.map((player) => ({ ...player, actionResponse: null }));
    const newDeck: Array<Influence> = [...deck];

    const influenceToKillIndex = newPlayers[loser.index].influences.findIndex(
      (influence) => influence.type === gameStateContext.killedInfluence && !influence.isDead,
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

    if (gameStateContext.challengeFailed) {
      const action = gameStateContext.action;
      if (!action) throw new Error("Action cannot be null when challenging.");
      const validInfluence = getInfluenceFromAction(action);

      const influenceToReveal = winner.player.influences.find((influence) => validInfluence === influence.type);
      if (!influenceToReveal)
        throw new Error(
          `The chosen influence as a result of the failed challenge is not in the losers hand: ${influenceToReveal}.`,
        );

      const influenceToTradeIndex = newPlayers[winner.index].influences.findIndex(
        (influence) => influence.type === influenceToReveal.type && !influence.isDead,
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
        lostInfluence: gameStateContext.killedInfluence,
        victimName: loser.player.name,
      },
      newDeck,
      newPlayers,
    };
  }
  return undefined;
}

export function processChallengeBlock(
  currentGameState: ICurrentGameState,
  players: Array<IPlayer>,
  getPlayersByIds: (playerIds: Array<string>) => Array<IFindPlayerByIdResponse>,
  deck: Array<Influence>,
): IProcessChallengeResponse | undefined {
  const gameStateContext = currentGameState.context;

  if (gameStateContext.challengeFailed !== undefined) {
    const [blocker, challenger] = getPlayersByIds([gameStateContext.blockerId, gameStateContext.challengerId]);

    if (!blocker) throw new PlayerNotFoundError(gameStateContext.blockerId);
    if (!challenger) throw new PlayerNotFoundError(gameStateContext.challengerId);

    const loser = gameStateContext.challengeFailed ? challenger : blocker;
    const winner = gameStateContext.challengeFailed ? blocker : challenger;

    const newPlayers: Array<IPlayer> = players.map((player) => ({ ...player, actionResponse: null }));
    const newDeck = [...deck];

    const influenceToKillIndex = newPlayers[loser.index].influences.findIndex(
      (influence) => influence.type === gameStateContext.killedInfluence && !influence.isDead,
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

    if (gameStateContext.challengeFailed) {
      const action = gameStateContext.action;
      if (!action) throw new Error("Action cannot be null when challenging.");
      const possibleInfluences = ActionDetails[action].blockable ?? [];

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
        lostInfluence: gameStateContext.killedInfluence,
        victimName: loser.player.name,
      },
      newDeck,
      newPlayers,
    };
  }
  return undefined;
}
