import { Actions } from "@contexts/GameStateContext";
import { usePlayers } from "@contexts/PlayersContext";
import type { ICurrentGameState, ISendGameStateUpdate } from "@GameState/types";
import useActionToast from "@hooks/useActionToast";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";
import { useEffect } from "react";

export default function useProcessBlock(
  currentGameState: ICurrentGameState,
  sendGameStateEvent: ISendGameStateUpdate,
): void {
  const gameStateContext = currentGameState.context;
  const { setPlayers, getNextPlayerTurnId, getPlayerById, resetAllActionResponse } = usePlayers();
  const actionToast = useActionToast();

  useEffect(() => {
    if (currentGameState.matches("blocked")) {
      if (gameStateContext.blockSuccessful) {
        actionToast({
          blockerName: getPlayerById(currentGameState.context.blockerId ?? "")?.player.name,
          performerName: getPlayerById(currentGameState.context.performerId)?.player.name,
          variant: Actions.Block,
        });
        resetAllActionResponse();
        sendGameStateEvent("COMPLETE", {
          nextPlayerTurnId: getNextPlayerTurnId(currentGameState.context.playerTurnId),
        });
      } else {
        // the blocker isn't going to challenge themselves so automatically set their response to PASS
        setPlayers((prevPlayers) => {
          const blocker = getPlayerById(currentGameState.context.blockerId);
          if (!blocker) throw new PlayerNotFoundError(currentGameState.context.blockerId);

          const playersWhoCanChallenge = prevPlayers
            .filter((player) => player.influences.some((i) => !i.isDead) && player.id !== blocker.player.id)
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
