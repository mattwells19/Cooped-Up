import { useGameState } from "@contexts/GameStateContext/GameStateContext";
import { Actions } from "@contexts/GameStateContext/types";
import { getPlayerById, getPlayersByIds } from "@utils/GameState/helperFns";
import { getInfluencesFromAction, wasValidAction } from "@utils/InfluenceUtils";
import * as React from "react";
import ActionProposedModal from "./Modals/ActionProposedModal";
import ChallengedModal from "./Modals/ChallengedModal";
import LoseInfluenceModal from "./Modals/LoseInfluenceModal";
import WaitingForActionModal from "./Modals/WaitingForActionModal";

const GameModalChooser: React.FC = () => {
	const {
		action,
		players,
		challengerId,
		currentPlayerId,
		performerId,
		victimId,
		handleGameEvent,
		handleActionResponse,
	} = useGameState();

	const [currentPlayer, performer, victim] = getPlayersByIds(players, [currentPlayerId, performerId, victimId])
		.map((p) => p.player);
	const challenger = challengerId ? getPlayerById(players, challengerId).player : null;
	if (!currentPlayer) throw new Error(`No player with the id ${currentPlayerId} was found.`);

	const [challengeResult, setChallengeResult] = React.useState<"success" | "failed" | null>(null);

	React.useEffect(() => {
		setChallengeResult(null);
	}, [action]);

	if (challenger && performer && action && !challengeResult) {
		const challengeFailed = performer.influences
			.filter((influence) => !influence.isDead)
			.some((influence) => wasValidAction(influence.type, action));

		return (
			<ChallengedModal
				performer={performer}
				challenger={challenger}
				actionInfluences={getInfluencesFromAction(action)}
				challengeFailed={challengeFailed}
				onDone={() => setChallengeResult(challengeFailed ? "failed" : "success")}
			/>
		);
	}
	// auto select the influence if the player has only one influence remaining
	if (challengeResult && performer && challenger) {
		const aliveInfluences = (challengeResult === "failed" ? challenger : performer)
			.influences
			.filter((influence) => !influence.isDead);

		if (aliveInfluences.length < 2) {
			setChallengeResult(null);
			handleGameEvent({
				event: "LOSE_INFLUENCE",
				eventPayload: {
					killedInfluence: aliveInfluences[0].type,
					challengeFailed: challengeResult === "failed",
				},
			});
		}
	}
	if (performer && challenger && challengeResult) {
		if (
			(challengeResult === "failed" && currentPlayer.id === challenger.id)
      || (challengeResult === "success" && currentPlayer.id === performer.id)
		) {
			return (
				<LoseInfluenceModal
					currentPlayer={currentPlayer}
					handleClose={(influenceToLose) => {
						setChallengeResult(null);
						handleGameEvent({
							event: "LOSE_INFLUENCE",
							eventPayload: {
								killedInfluence: influenceToLose,
								challengeFailed: challengeResult === "failed",
							},
						});
					}}
				/>
			);
		}
		const success = challengeResult === "success";
		return (
			<WaitingForActionModal
				messaging={[
					`${challenger.name}'s challenge against ${performer.name} ${success ? "was successful" : "failed"}.`,
					`Waiting for ${success ? performer.name : challenger.name} to choose an Influence to lose.`,
				]}
			/>
		);
	}
	if (action === Actions.Coup && performer && victim) {
		return currentPlayer.id === victim.id ? (
		// current player being coup'd
			<LoseInfluenceModal
				currentPlayer={currentPlayer}
				handleClose={(influenceToLose) => handleGameEvent({
					event: "PASS",
					eventPayload: { killedInfluence: influenceToLose },
				})}
			/>
		) : (
		// some other player being coup'd
			<WaitingForActionModal
				messaging={[
					`${performer.name} has chosen to ${action} ${victim.name}.`,
					`Waiting for ${victim.name} to choose an Influence to lose.`,
				]}
			/>
		);
	}
	if (action && action !== Actions.Coup && action !== Actions.Income && performer) {
		return currentPlayer.actionResponse === "PASS" ? (
		// player decided not to challenge
			<WaitingForActionModal
				messaging={[
					"You have chosen to pass.",
					"Waiting for all players to pass/challenge...",
				]}
			/>
		) : (
		// player given the option to challenge
			<ActionProposedModal
				action={action}
				performer={performer}
				handleClose={handleActionResponse}
			/>
		);
	}
	// idle
	return <></>;
};

export default GameModalChooser;
