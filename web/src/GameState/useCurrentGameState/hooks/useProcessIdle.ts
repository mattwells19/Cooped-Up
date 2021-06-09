import { usePlayers } from "@contexts/PlayersContext";
import type { ICurrentGameState, IGameStateRoles, ISendGameStateUpdate } from "@GameState/types";
import { useEffect } from "react";

export default function useProcessIdle(
  currentGameState: ICurrentGameState,
  sendGameStateEvent: ISendGameStateUpdate,
  { currentPlayerTurn }: IGameStateRoles,
): void {
  const { players, setPlayers, getNextPlayerTurnId } = usePlayers();

  useEffect(() => {
    if (currentGameState.matches("pregame")) {
      // reset all player influences. really only applies on "Play Again" workflow
      setPlayers((prev) =>
        prev.map((player) => (player.influences.length > 0 ? { ...player, influences: [] } : player)),
      );
    } else if (currentGameState.matches("idle")) {
      // once the game starts influences aren't distributed yet so this would run indefinitely
      if (currentPlayerTurn.influences.length > 0) {
        const playersStillAlive = players.filter((player) => player.influences.some((influence) => !influence.isDead));

        // check if game should be over
        if (playersStillAlive.length === 1) {
          sendGameStateEvent("END_GAME", { winningPlayerId: playersStillAlive[0].id });

          // extra check to make sure the new current player didn't lose their last influence last turn
        } else if (currentPlayerTurn.influences.every((i) => i.isDead)) {
          sendGameStateEvent("COMPLETE", {
            nextPlayerTurnId: getNextPlayerTurnId(currentPlayerTurn.id),
          });
        }
      }
    }
  }, [currentGameState.value]);
}
