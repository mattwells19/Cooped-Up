import { Actions } from "@contexts/GameStateContext";
import { usePlayers } from "@contexts/PlayersContext";
import { useEffect } from "react";
import type { ICurrentGameState, IGameStateRoles, ISendGameStateUpdate } from "../../types";

export default function useProcessProposeAction(
  currentGameState: ICurrentGameState,
  sendGameStateEvent: ISendGameStateUpdate,
  { performer, victim }: IGameStateRoles,
): void {
  const gameStateContext = currentGameState.context;
  const { setPlayers } = usePlayers();

  useEffect(() => {
    if (!currentGameState.matches("propose_action")) return;

    switch (gameStateContext.action) {
      case Actions.Coup: {
        if (!victim) throw new Error("No victim found when trying to propose Coup.");

        // if victim only has one influence skip the selection step and eliminate the single influence
        const victimAliveInfluences = victim.influences.filter((i) => !i.isDead);
        if (victimAliveInfluences.length < 2) {
          sendGameStateEvent("PASS", { killedInfluence: victimAliveInfluences[0].type });
        }

        break;
      }
      case Actions.Income:
        sendGameStateEvent("PASS"); // auto pass on income as it cannot be blocked or challenged
        break;
      case Actions.Tax:
      case Actions.Aid:
      case Actions.Steal:
        // the performer isn't going to challenge themselves so automatically set their response to PASS
        setPlayers((prevPlayers) => {
          if (!performer) throw new Error("No performer found when trying to propose Steal.");

          const playersWhoCanChallenge = prevPlayers
            .filter((player) => player.influences.some((i) => !i.isDead) && player.id !== performer.id)
            .map((player) => player.id);

          const newPlayers = prevPlayers.map((player) => {
            if (playersWhoCanChallenge.includes(player.id)) return player;
            else
              return {
                ...player,
                actionResponse: { type: "PASS" as const },
              };
          });

          return newPlayers;
        });
        break;
      default:
        throw new Error(`The action ${gameStateContext.action} either does not exist or is not implemented yet.`);
    }
  }, [currentGameState.value]);
}
