import { Actions } from "@contexts/GameStateContext";
import type { IActionToastProps } from "@hooks/useActionToast";
import usePlayerActions from "./usePlayerActions";
import type { ICurrentGameState, ISendGameStateUpdate } from "../../types";
import { usePlayers } from "@contexts/PlayersContext";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";
import useActionToast from "@hooks/useActionToast";
import { useEffect } from "react";

export default function useProcessPerformAction(
  currentGameState: ICurrentGameState,
  sendGameStateEvent: ISendGameStateUpdate,
): void {
  const gameStateContext = currentGameState.context;
  const { setPlayers, getPlayerById, getNextPlayerTurnId } = usePlayers();
  const actionToast = useActionToast();
  const { performAidAction, performCoupAction, performIncomeAction, performStealAction, performTaxAction } =
    usePlayerActions(gameStateContext);

  useEffect(() => {
    if (!currentGameState.matches("perform_action")) return;

    const processAction = (): IActionToastProps => {
      switch (gameStateContext.action) {
        case Actions.Coup: {
          if (!gameStateContext.killedInfluence) throw new Error("No influence was selected to eliminate.");

          setPlayers((prevPlayers) => performCoupAction(prevPlayers));
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
          setPlayers((prevPlayers) => performIncomeAction(prevPlayers));

          const performer = getPlayerById(gameStateContext.playerTurnId)?.player;
          if (!performer) throw new PlayerNotFoundError(gameStateContext.playerTurnId);

          return {
            performerName: performer.name,
            variant: Actions.Income,
          };
        }
        case Actions.Tax: {
          setPlayers((prevPlayers) => performTaxAction(prevPlayers));

          const performer = getPlayerById(gameStateContext.performerId)?.player;
          if (!performer) throw new PlayerNotFoundError(gameStateContext.performerId);

          return {
            performerName: performer.name,
            variant: Actions.Tax,
          };
        }
        case Actions.Aid: {
          setPlayers((prevPlayers) => performAidAction(prevPlayers));

          const performer = getPlayerById(gameStateContext.performerId)?.player;
          if (!performer) throw new PlayerNotFoundError(gameStateContext.performerId);

          return {
            performerName: performer.name,
            variant: Actions.Aid,
          };
        }
        case Actions.Steal: {
          setPlayers((prevPlayers) => performStealAction(prevPlayers));

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
    };

    const actionToastProps = processAction();
    actionToast(actionToastProps);
    sendGameStateEvent("COMPLETE", {
      nextPlayerTurnId: getNextPlayerTurnId(gameStateContext.playerTurnId),
    });
  }, [currentGameState.value]);
}
