import { Actions } from "@contexts/GameStateContext";
import { usePlayers } from "@contexts/PlayersContext";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";
import type { ICurrentGameState, ISendGameStateUpdate } from "../../types";

interface IUseProcessProposeAction {
  processProposeAction: () => void;
}

export default function useProcessProposeAction(
  currentGameState: ICurrentGameState,
  sendGameStateEvent: ISendGameStateUpdate,
): IUseProcessProposeAction {
  const gameStateContext = currentGameState.context;
  const { setPlayers, getPlayerById } = usePlayers();

  function processProposeAction(): void {
    switch (gameStateContext.action) {
      case Actions.Coup: {
        const victim = getPlayerById(gameStateContext.victimId)?.player;
        if (!victim) throw new PlayerNotFoundError(gameStateContext.victimId);

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
          const performer = getPlayerById(gameStateContext.performerId);
          if (!performer) throw new PlayerNotFoundError(gameStateContext.performerId);

          const playersWhoCanChallenge = prevPlayers
            .filter((player) => player.influences.some((i) => !i.isDead) && player.id !== performer.player.id)
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
  }

  return { processProposeAction };
}
