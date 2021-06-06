import type { IPlayer } from "@contexts/GameStateContext";
import { usePlayers } from "@contexts/PlayersContext";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";
import type { IGameStateMachineContext } from "../../GameStateMachine";

interface IUsePlayerActions {
  performIncomeAction: () => void;
  performCoupAction: () => void;
  performTaxAction: () => void;
  performAidAction: () => void;
  performStealAction: () => void;
}

export default function usePlayerActions(gameStateContext: IGameStateMachineContext): IUsePlayerActions {
  const { setPlayers, getPlayerById } = usePlayers();

  function IncomeAction(players: Array<IPlayer>) {
    const currentPlayer = getPlayerById(gameStateContext.playerTurnId);
    if (!currentPlayer) throw new PlayerNotFoundError(gameStateContext.playerTurnId);

    const newPlayers = [...players];
    newPlayers[currentPlayer.index] = {
      ...newPlayers[currentPlayer.index],
      coins: newPlayers[currentPlayer.index].coins + 1,
    };
    return newPlayers;
  }

  function CoupAction(players: Array<IPlayer>) {
    const currentPlayer = getPlayerById(gameStateContext.playerTurnId);
    if (!currentPlayer) throw new PlayerNotFoundError(gameStateContext.playerTurnId);

    const victim = getPlayerById(gameStateContext.victimId);
    if (!victim) throw new PlayerNotFoundError(gameStateContext.victimId);

    const newPlayers = [...players];

    // performer loses 7 coins
    newPlayers[currentPlayer.index] = {
      ...newPlayers[currentPlayer.index],
      coins: newPlayers[currentPlayer.index].coins - 7,
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

  function TaxAction(players: Array<IPlayer>) {
    const performer = getPlayerById(gameStateContext.performerId);
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

  function AidAction(players: Array<IPlayer>) {
    const performer = getPlayerById(gameStateContext.performerId);
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

  function StealAction(players: Array<IPlayer>) {
    const currentPlayer = getPlayerById(gameStateContext.playerTurnId);
    if (!currentPlayer) throw new PlayerNotFoundError(gameStateContext.playerTurnId);

    const victim = getPlayerById(gameStateContext.victimId);
    if (!victim) throw new PlayerNotFoundError(gameStateContext.victimId);

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
  }

  return {
    performAidAction: () => setPlayers((prevPlayers) => StealAction(prevPlayers)),
    performCoupAction: () => setPlayers((prevPlayers) => CoupAction(prevPlayers)),
    performIncomeAction: () => setPlayers((prevPlayers) => AidAction(prevPlayers)),
    performStealAction: () => setPlayers((prevPlayers) => TaxAction(prevPlayers)),
    performTaxAction: () => setPlayers((prevPlayers) => IncomeAction(prevPlayers)),
  };
}
