import useActionToast from "@hooks/useActionToast";
import { useEffect } from "react";
import { useMachine } from "@xstate/react";
import GameStateMachine from "./GameStateMachine";
import type { ICurrentGameState, ISendGameStateUpdate } from "./types";
import processProposeAction from "./ProcessProposeAction";
import processPerformAction from "./ProcessPerformAction";
import { processChallenge, processChallengeBlock } from "./ProcessChallenge";
import { usePlayers } from "@contexts/PlayersContext";
import { useDeck } from "@contexts/DeckContext";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";
import { Actions } from "@contexts/GameStateContext";

export default function useCurrentGameState(): [ICurrentGameState, ISendGameStateUpdate] {
  const { players, setPlayers, getNextPlayerTurnId, getPlayerById, getPlayersByIds, resetAllActionResponse } =
    usePlayers();
  const { deck, setDeck } = useDeck();
  const [currentGameState, sendGameStateEvent] = useMachine(GameStateMachine);
  const actionToast = useActionToast();

  useEffect(() => {
    switch (true) {
      case currentGameState.matches("game_over"):
        break;
      case currentGameState.matches("pregame"): {
        // reset all player influences. really only applies on "Play Again" workflow
        setPlayers((prev) =>
          prev.map((player) => (player.influences.length > 0 ? { ...player, influences: [] } : player)),
        );
        break;
      }
      case currentGameState.matches("idle"): {
        const currentPlayer = getPlayerById(currentGameState.context.playerTurnId)?.player;
        if (!currentPlayer) throw new PlayerNotFoundError(currentGameState.context.playerTurnId);

        // once the game starts influences aren't distributed yet so this would run indefinitely
        if (currentPlayer.influences.length > 0) {
          const playersStillAlive = players.filter((player) =>
            player.influences.some((influence) => !influence.isDead),
          );

          // check if game should be over
          if (playersStillAlive.length === 1) {
            sendGameStateEvent("END_GAME", { winningPlayerId: playersStillAlive[0].id });

            // extra check to make sure the new current player didn't lose their last influence last turn
          } else if (currentPlayer.influences.every((i) => i.isDead)) {
            sendGameStateEvent("COMPLETE", {
              nextPlayerTurnId: getNextPlayerTurnId(currentGameState.context.playerTurnId),
            });
          }
        }

        break;
      }
      case currentGameState.matches("challenged"): {
        // challenge result will be undefined until the loser of the challenge selects their influence to lose
        const challengeResult = processChallenge(currentGameState, players, getPlayersByIds, deck);

        if (challengeResult) {
          setPlayers(challengeResult.newPlayers);
          setDeck(challengeResult.newDeck);
          actionToast(challengeResult.actionToastProps);

          if (currentGameState.context.challengeFailed) sendGameStateEvent("FAILED");
          else {
            sendGameStateEvent("COMPLETE", {
              nextPlayerTurnId: getNextPlayerTurnId(currentGameState.context.playerTurnId),
            });
          }
        }
        break;
      }
      case currentGameState.matches("challenge_block"): {
        // challenge result will be undefined until the loser of the challenge selects their influence to lose
        const challengeResult = processChallengeBlock(currentGameState, players, getPlayersByIds, deck);

        if (challengeResult) {
          setPlayers(challengeResult.newPlayers);
          setDeck(challengeResult.newDeck);
          actionToast(challengeResult.actionToastProps);

          if (currentGameState.context.challengeFailed)
            sendGameStateEvent("CHALLENGE_BLOCK_FAILED", {
              nextPlayerTurnId: getNextPlayerTurnId(currentGameState.context.playerTurnId),
            });
          else sendGameStateEvent("COMPLETE");
        }
        break;
      }
      case currentGameState.matches("blocked"): {
        if (currentGameState.context.blockSuccessful) {
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
        break;
      }
      case currentGameState.matches("propose_action"):
        processProposeAction(currentGameState, sendGameStateEvent, setPlayers, getPlayerById);
        break;
      case currentGameState.matches("perform_action"): {
        const actionToastProps = processPerformAction(currentGameState, setPlayers, getPlayerById);
        actionToast(actionToastProps);
        sendGameStateEvent("COMPLETE", {
          nextPlayerTurnId: getNextPlayerTurnId(currentGameState.context.playerTurnId),
        });
        break;
      }
      default:
        throw new Error(`The state '${currentGameState.value}' has either not been implemented or does not exist`);
    }
  }, [currentGameState.value, currentGameState.context.challengeFailed, currentGameState.context.blockSuccessful]);

  return [currentGameState, sendGameStateEvent];
}
