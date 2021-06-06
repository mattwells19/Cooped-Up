import { Actions } from "@contexts/GameStateContext";
import type { IActionToastProps } from "@hooks/useActionToast";
import usePlayerActions from "./usePlayerActions";
import type { ICurrentGameState } from "../../types";
import { usePlayers } from "@contexts/PlayersContext";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";

interface IUseProcessPerformAction {
  processPerformAction: () => IActionToastProps;
}

export default function useProcessPerformAction(currentGameState: ICurrentGameState): IUseProcessPerformAction {
  const gameStateContext = currentGameState.context;
  const { getPlayerById } = usePlayers();
  const { performAidAction, performCoupAction, performIncomeAction, performStealAction, performTaxAction } =
    usePlayerActions(gameStateContext);

  function processPerformAction(): IActionToastProps {
    switch (gameStateContext.action) {
      case Actions.Coup: {
        if (!gameStateContext.killedInfluence) throw new Error("No influence was selected to eliminate.");

        performCoupAction();
        const performer = getPlayerById(gameStateContext.performerId)?.player;
        const victim = getPlayerById(gameStateContext.victimId)?.player;

        if (!performer) throw new PlayerNotFoundError(gameStateContext.performerId);
        if (!victim) throw new PlayerNotFoundError(gameStateContext.victimId);

        return {
          lostInfluence: gameStateContext.killedInfluence,
          performerName: performer.name,
          variant: Actions.Coup,
          victimName: victim.name,
        };
      }
      case Actions.Income: {
        performIncomeAction();

        const performer = getPlayerById(gameStateContext.playerTurnId)?.player;
        if (!performer) throw new PlayerNotFoundError(gameStateContext.playerTurnId);

        return {
          performerName: performer.name,
          variant: Actions.Income,
        };
      }
      case Actions.Tax: {
        performTaxAction();

        const performer = getPlayerById(gameStateContext.performerId)?.player;
        if (!performer) throw new PlayerNotFoundError(gameStateContext.performerId);

        return {
          performerName: performer.name,
          variant: Actions.Tax,
        };
      }
      case Actions.Aid: {
        performAidAction();

        const performer = getPlayerById(gameStateContext.performerId)?.player;
        if (!performer) throw new PlayerNotFoundError(gameStateContext.performerId);

        return {
          performerName: performer.name,
          variant: Actions.Aid,
        };
      }
      case Actions.Steal: {
        performStealAction();

        const performer = getPlayerById(gameStateContext.performerId)?.player;
        const victim = getPlayerById(gameStateContext.victimId)?.player;

        if (!performer) throw new PlayerNotFoundError(gameStateContext.performerId);
        if (!victim) throw new PlayerNotFoundError(gameStateContext.victimId);

        return {
          performerName: performer.name,
          variant: Actions.Steal,
          victimName: victim.name,
        };
      }
      default:
        throw new Error(`The action ${gameStateContext.action} either does not exist or is not implemented yet.`);
    }
  }

  return { processPerformAction };
}
