import useActionToast from "@hooks/useActionToast";
import { Dispatch, SetStateAction, useEffect } from "react";
import type { IPlayer } from "@contexts/GameStateContext/types";
import { useMachine } from "@xstate/react";
import GameStateMachine from "./GameStateMachine";
import { getNextPlayerTurnId } from "./helperFns";
import type { ICurrentGameState, ISendGameStateUpdate } from "./types";
import processProposeAction from "./ProcessProposeAction";
import processPerformAction from "./ProcessPerformAction";
import processChallenge from "./ProcessChallenge";

export default function useCurrentGameState(
  playerState: [IPlayer[], Dispatch<SetStateAction<IPlayer[]>>],
): [ICurrentGameState, ISendGameStateUpdate] {
  const [players, setPlayers] = playerState;
  const [currentGameState, sendGameStateEvent] = useMachine(GameStateMachine);
  const actionToast = useActionToast();

  useEffect(() => {
    switch (true) {
      case currentGameState.matches("pregame"):
      case currentGameState.matches("idle"):
        break;
      case currentGameState.matches("challenged"): {
        const actionToastProps = processChallenge(currentGameState, [players, setPlayers]);
        if (actionToastProps) {
          actionToast(actionToastProps);
          if (currentGameState.context.challengeFailed) sendGameStateEvent("FAILED");
          else {
            sendGameStateEvent("COMPLETE", {
              nextPlayerTurnId: getNextPlayerTurnId(players, currentGameState.context.playerTurnId),
            });
          }
        }
        break;
      }
      case currentGameState.matches("propose_action"):
        processProposeAction(currentGameState, [players, setPlayers], sendGameStateEvent);
        break;
      case currentGameState.matches("perform_action"): {
        const actionToastProps = processPerformAction(currentGameState, [players, setPlayers]);
        actionToast(actionToastProps);
        sendGameStateEvent("COMPLETE", {
          nextPlayerTurnId: getNextPlayerTurnId(players, currentGameState.context.playerTurnId),
        });
        break;
      }
      default:
        throw new Error(`The state '${currentGameState.value}' has either not been implemented or does not exist`);
    }
  }, [currentGameState.value, currentGameState.context.challengeFailed]);

  return [currentGameState, sendGameStateEvent];
}