import type { IPlayer } from "@contexts/GameStateContext/types";
import type { IGameStateMachineContext } from "./GameStateMachine";

/**
 * A function that finds the player with the specified ID.
 * @param players The array of players in the lobby.
 * @param playerId The id of the player being looked up.
 * @returns The player object and player index as an object.
 */
export function getPlayerById(
  players: Array<IPlayer>,
  playerId: string,
): { player: IPlayer | undefined; index: number } {
  const playerIndex = players.findIndex((p) => p.id.localeCompare(playerId) === 0);
  return {
    player: players[playerIndex],
    index: playerIndex,
  };
}

/**
 * Gets the id of the player whose turn it should be next.
 * @param players The array of players in the lobby.
 * @param playerTurnId he id of the player whose turn it is.
 * @returns The id of the player whose turn it should be next.
 */
export function getNextPlayerTurnId(players: Array<IPlayer>, playerTurnId: string): string {
  const currentPlayerIndex = players.findIndex((p) => p.id.localeCompare(playerTurnId) === 0);
  return players[currentPlayerIndex === players.length - 1 ? 0 : currentPlayerIndex + 1].id;
}

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
