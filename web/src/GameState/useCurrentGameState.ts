/* eslint-disable indent */
// There's something wrong with the way eslint is calculating the indent inside the switch.

import useActionToast from "@hooks/useActionToast";
import { useEffect } from "react";
import { useMachine } from "@xstate/react";
import GameStateMachine from "./GameStateMachine";
import type { ICurrentGameState, ISendGameStateUpdate } from "./types";
import processProposeAction from "./ProcessProposeAction";
import processPerformAction from "./ProcessPerformAction";
import processChallenge from "./ProcessChallenge";
import { usePlayers } from "@contexts/PlayersContext";
import { useDeck } from "@contexts/DeckContext";

export default function useCurrentGameState(): [ICurrentGameState, ISendGameStateUpdate] {
	const { players, setPlayers, getNextPlayerTurnId, getPlayerById, getPlayersByIds } = usePlayers();
	const { deck, setDeck } = useDeck();
	const [currentGameState, sendGameStateEvent] = useMachine(GameStateMachine);
	const actionToast = useActionToast();

	useEffect(() => {
		switch (true) {
			case currentGameState.matches("pregame"):
			case currentGameState.matches("idle"):
				break;
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
	}, [currentGameState.value, currentGameState.context.challengeFailed]);

	return [currentGameState, sendGameStateEvent];
}
