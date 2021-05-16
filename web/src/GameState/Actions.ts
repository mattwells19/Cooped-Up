import type { IPlayer } from "@contexts/GameStateContext";
import type { IFindPlayerByIdResponse } from "@contexts/PlayersContext";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";
import type { IGameStateMachineContext } from "./GameStateMachine";

type ActionFunction = (
  players: Array<IPlayer>,
  gameContext: IGameStateMachineContext,
  getPlayerById: (playerId: string) => IFindPlayerByIdResponse,
) => Array<IPlayer>;

export const IncomeAction: ActionFunction = (players, gameContext, getPlayerById) => {
  const currentPlayer = getPlayerById(gameContext.playerTurnId);
  if (!currentPlayer) throw new PlayerNotFoundError(gameContext.playerTurnId);

  const newPlayers = [...players];
  newPlayers[currentPlayer.index] = {
    ...newPlayers[currentPlayer.index],
    coins: newPlayers[currentPlayer.index].coins + 1,
  };
  return newPlayers;
};

export const CoupAction: ActionFunction = (players, gameContext, getPlayerById) => {
  const currentPlayer = getPlayerById(gameContext.playerTurnId);
  if (!currentPlayer) throw new PlayerNotFoundError(gameContext.playerTurnId);

  const victim = getPlayerById(gameContext.victimId);
  if (!victim) throw new PlayerNotFoundError(gameContext.victimId);

  const newPlayers = [...players];

  // performer loses 7 coins
  newPlayers[currentPlayer.index] = {
    ...newPlayers[currentPlayer.index],
    coins: newPlayers[currentPlayer.index].coins - 7,
  };

  const influenceToKillIndex = newPlayers[victim.index].influences.findIndex(
    (influence) => influence.type === gameContext.killedInfluence && !influence.isDead,
  );

  // victim's chosen influence to kill
  newPlayers[victim.index] = {
    ...newPlayers[victim.index],
    influences: newPlayers[victim.index].influences.map((influence, index) => {
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

export const TaxAction: ActionFunction = (players, gameContext, getPlayerById) => {
  const performer = getPlayerById(gameContext.performerId);
  if (!performer) throw new PlayerNotFoundError(gameContext.performerId);

  const newPlayers = players.map((p) => ({
    ...p,
    actionResponse: null,
  }));

  // performer loses 7 coins
  newPlayers[performer.index] = {
    ...newPlayers[performer.index],
    coins: newPlayers[performer.index].coins + 3,
  };

  return newPlayers;
};

export const AidAction: ActionFunction = (players, gameContext, getPlayerById) => {
  const performer = getPlayerById(gameContext.performerId);
  if (!performer) throw new PlayerNotFoundError(gameContext.performerId);

  const newPlayers = players.map((p) => ({
    ...p,
    actionResponse: null,
  }));

  // performer receives 2 coins
  newPlayers[performer.index] = {
    ...newPlayers[performer.index],
    coins: newPlayers[performer.index].coins + 2,
  };

  return newPlayers;
};

export const StealAction: ActionFunction = (players, gameContext, getPlayerById) => {
  const currentPlayer = getPlayerById(gameContext.playerTurnId);
  if (!currentPlayer) throw new PlayerNotFoundError(gameContext.playerTurnId);

  const victim = getPlayerById(gameContext.victimId);
  if (!victim) throw new PlayerNotFoundError(gameContext.victimId);

  const newPlayers = players.map((p) => ({
    ...p,
    actionResponse: null,
  }));

  // performer gains 2 coins
  newPlayers[currentPlayer.index] = {
    ...newPlayers[currentPlayer.index],
    coins: newPlayers[currentPlayer.index].coins + 2,
  };

  // victim loses 2 coins
  newPlayers[victim.index] = {
    ...newPlayers[victim.index],
    coins: newPlayers[victim.index].coins - 2,
  };

  return newPlayers;
};
