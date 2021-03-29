import type { IPlayer } from "@contexts/GameStateContext/types";
import type { IGameStateMachineContext } from "./GameStateMachine";
import { getPlayerById } from "./helperFns";

type ActionFunction = (players: Array<IPlayer>, gameContext: IGameStateMachineContext) => Array<IPlayer>;

export const IncomeAction: ActionFunction = (players, gameContext) => {
  const { index: currentPlayerIndex } = getPlayerById(players, gameContext.playerTurnId);
  const newPlayers = [...players];
  newPlayers[currentPlayerIndex] = {
    ...newPlayers[currentPlayerIndex],
    coins: newPlayers[currentPlayerIndex].coins + 1,
  };
  return newPlayers;
};

export const CoupAction: ActionFunction = (players, gameContext) => {
  const currentPlayerIndex = getPlayerById(players, gameContext.playerTurnId).index;
  const victimIndex = getPlayerById(players, gameContext.victimId).index;

  const newPlayers = [...players];

  // performer loses 7 coins
  newPlayers[currentPlayerIndex] = {
    ...newPlayers[currentPlayerIndex],
    coins: newPlayers[currentPlayerIndex].coins - 7,
  };

  const influenceToKillIndex = newPlayers[victimIndex].influences.findIndex(
    (influence) => influence.type === gameContext.killedInfluence && !influence.isDead,
  );

  // victim's chosen influence to kill
  newPlayers[victimIndex] = {
    ...newPlayers[victimIndex],
    influences: newPlayers[victimIndex].influences.map((influence, index) => {
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
};

export const TaxAction: ActionFunction = (players, gameContext) => {
  const performerIndex = getPlayerById(players, gameContext.performerId).index;

  const newPlayers = players.map((p) => ({
    ...p,
    actionResponse: null,
  }));

  // performer loses 7 coins
  newPlayers[performerIndex] = {
    ...newPlayers[performerIndex],
    coins: newPlayers[performerIndex].coins + 3,
  };

  return newPlayers;
};
