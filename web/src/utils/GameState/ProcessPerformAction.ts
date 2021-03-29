import { Actions, IPlayer } from "@contexts/GameStateContext/types";
import type { IActionToastProps } from "@hooks/useActionToast";
import type { Dispatch, SetStateAction } from "react";
import { CoupAction, getPlayerById, IncomeAction, TaxAction } from "./Actions";
import type { ICurrentGameState } from "./types";

export default function processPerformAction(
  currentGameState: ICurrentGameState,
  playerState: [IPlayer[], Dispatch<SetStateAction<IPlayer[]>>],
): IActionToastProps {
  const [players, setPlayers] = playerState;

  switch (currentGameState.context.action) {
    case Actions.Coup: {
      if (!currentGameState.context.killedInfluence) throw new Error("No influence was selected to eliminate.");

      setPlayers((prevPlayers) => CoupAction(prevPlayers, currentGameState.context));
      const performer = getPlayerById(players, currentGameState.context.performerId).player;
      const victim = getPlayerById(players, currentGameState.context.victimId).player;

      if (!performer) throw new Error(`No player was found with the id ${currentGameState.context.performerId}.`);
      if (!victim) throw new Error(`No player was found with the id ${currentGameState.context.victimId}.`);

      return {
        performerName: performer.name,
        victimName: victim.name,
        variant: Actions.Coup,
        lostInfluence: currentGameState.context.killedInfluence,
      };
    }
    case Actions.Income: {
      setPlayers((prevPlayers) => IncomeAction(prevPlayers, currentGameState.context));
      const performer = getPlayerById(players, currentGameState.context.playerTurnId).player;
      if (!performer) throw new Error(`No player was found with the id ${currentGameState.context.playerTurnId}.`);

      return {
        performerName: performer.name,
        variant: Actions.Income,
      };
    }
    case Actions.Tax: {
      setPlayers((prevPlayers) => TaxAction(prevPlayers, currentGameState.context));
      const performer = getPlayerById(players, currentGameState.context.performerId).player;

      if (!performer) throw new Error(`No player was found with the id ${currentGameState.context.performerId}.`);

      return {
        performerName: performer.name,
        variant: Actions.Tax,
      };
    }
    default:
      throw new Error(`The action ${currentGameState.context.action} either does not exist or is not implemented yet.`);
  }
}
