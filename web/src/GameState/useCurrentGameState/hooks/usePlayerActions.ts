import type { IPlayer } from "@contexts/GameStateContext";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";
import type { IGameStateMachineContext } from "../../GameStateMachine";

interface IUsePlayerActions {
  performIncomeAction: (players: Array<IPlayer>) => Array<IPlayer>;
  performCoupAction: (players: Array<IPlayer>) => Array<IPlayer>;
  performTaxAction: (players: Array<IPlayer>) => Array<IPlayer>;
  performAidAction: (players: Array<IPlayer>) => Array<IPlayer>;
  performStealAction: (players: Array<IPlayer>) => Array<IPlayer>;
}

export default function usePlayerActions(
  gameStateContext: IGameStateMachineContext,
  performer: IPlayer | undefined,
  victim: IPlayer | undefined,
): IUsePlayerActions {
  function IncomeAction(players: Array<IPlayer>): Array<IPlayer> {
    if (!performer) throw new PlayerNotFoundError(gameStateContext.performerId);

    const newPlayers = [...players];
    newPlayers[performer.index] = {
      ...newPlayers[performer.index],
      coins: newPlayers[performer.index].coins + 1,
    };

    return newPlayers;
  }

  function CoupAction(players: Array<IPlayer>): Array<IPlayer> {
    if (!performer) throw new PlayerNotFoundError(gameStateContext.performerId);
    if (!victim) throw new PlayerNotFoundError(gameStateContext.victimId);

    const newPlayers = [...players];

    // performer loses 7 coins
    newPlayers[performer.index] = {
      ...newPlayers[performer.index],
      coins: newPlayers[performer.index].coins - 7,
    };

    const influenceToKillIndex = newPlayers[victim.index].influences.findIndex(
      (influence) => influence.type === gameStateContext.killedInfluence && !influence.isDead,
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
  }

  function TaxAction(players: Array<IPlayer>): Array<IPlayer> {
    if (!performer) throw new PlayerNotFoundError(gameStateContext.performerId);

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
  }

  function AidAction(players: Array<IPlayer>): Array<IPlayer> {
    if (!performer) throw new PlayerNotFoundError(gameStateContext.performerId);

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
  }

  function StealAction(players: Array<IPlayer>): Array<IPlayer> {
    if (!performer) throw new PlayerNotFoundError(gameStateContext.performerId);
    if (!victim) throw new PlayerNotFoundError(gameStateContext.victimId);

    const newPlayers = players.map((p) => ({
      ...p,
      actionResponse: null,
    }));

    // performer gains 2 coins
    newPlayers[performer.index] = {
      ...newPlayers[performer.index],
      coins: newPlayers[performer.index].coins + 2,
    };

    // victim loses 2 coins
    newPlayers[victim.index] = {
      ...newPlayers[victim.index],
      coins: newPlayers[victim.index].coins - 2,
    };

    return newPlayers;
  }

  return {
    performAidAction: AidAction,
    performCoupAction: CoupAction,
    performIncomeAction: IncomeAction,
    performStealAction: StealAction,
    performTaxAction: TaxAction,
  };
}
