import { Actions } from "@contexts/GameStateContext";
import { usePlayers } from "@contexts/PlayersContext";
import type { ICurrentGameState, IGameStateRoles, ISendGameStateUpdate } from "@GameState/types";
import useActionToast from "@hooks/useActionToast";
import { getCounterActionFromAction } from "@utils/CounterActionUtils";
import { useEffect } from "react";

export default function useProcessBlock(
  currentGameState: ICurrentGameState,
  sendGameStateEvent: ISendGameStateUpdate,
  { blocker, performer, currentPlayerTurn }: IGameStateRoles,
): void {
  const gameStateContext = currentGameState.context;
  const { setPlayers, getNextPlayerTurnId, resetAllActionResponse } = usePlayers();
  const actionToast = useActionToast();

  useEffect(() => {
    if (currentGameState.matches("blocked")) {
      if (!blocker) throw new Error("No blocker found when processing block.");

      if (gameStateContext.blockSuccessful) {
        const action = gameStateContext.action;
        if (!action) throw new Error("No action when processing successful block.");
        if (!performer) throw new Error("No performer found when processing successful block.");
        if (!currentPlayerTurn) throw new Error("No one's turn when processing successful block.");

        const counterAction = getCounterActionFromAction(action);
        if (!counterAction) throw new Error(`No counter action for ${action}.`);

        actionToast({
          blockerName: blocker.name,
          performerName: performer.name,
          variant: counterAction,
        });
        resetAllActionResponse();
        sendGameStateEvent("COMPLETE", {
          nextPlayerTurnId: getNextPlayerTurnId(currentPlayerTurn.id),
        });
      } else {
        // the blocker isn't going to challenge themselves so automatically set their response to PASS
        setPlayers((prevPlayers) => {
          const playersWhoCanChallenge = prevPlayers
            .filter((player) => player.influences.some((i) => !i.isDead) && player.id !== blocker.id)
            .map((player) => player.id);

          const newPlayers = prevPlayers.map((player) => ({
            ...player,
            actionResponse: playersWhoCanChallenge.includes(player.id) ? null : { type: "PASS" as const },
          }));

          return newPlayers;
        });
      }
    }
  }, [currentGameState.value, gameStateContext.blockSuccessful]);
}
