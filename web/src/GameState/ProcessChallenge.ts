import type { Influence, IPlayer } from "@contexts/GameStateContext";
import type { IFindPlayerByIdResponse } from "@contexts/PlayersContext";
import type { IActionToastProps } from "@hooks/useActionToast";
import { getInfluencesFromAction } from "@utils/InfluenceUtils";
import type { ICurrentGameState } from "./types";

interface IProcessChallengeResponse {
	actionToastProps: IActionToastProps;
	newPlayers: Array<IPlayer>;
	newDeck: Array<Influence>;
}

export default function processChallenge(
	currentGameState: ICurrentGameState,
	players: Array<IPlayer>,
	getPlayersByIds: (playerIds: Array<string>) => Array<IFindPlayerByIdResponse>,
	deck: Array<Influence>,
): IProcessChallengeResponse | undefined {
	const { action, killedInfluence, challengeFailed, challengerId, performerId } = currentGameState.context;

	if (action && killedInfluence && challengeFailed !== undefined && challengerId && performerId) {
		const loserId = challengeFailed ? challengerId : performerId;
		const winnerId = challengeFailed ? performerId : challengerId;
		const [{ index: loserIndex, player: loser }, { index: winnerIndex, player: winner }] = getPlayersByIds([
			loserId,
			winnerId,
		]);

		const newPlayers: Array<IPlayer> = [...players].map((player) => ({ ...player, actionResponse: null }));
		const newDeck: Array<Influence> = [...deck];

		const influenceToKillIndex = newPlayers[loserIndex].influences.findIndex(
			(influence) => influence.type === killedInfluence && !influence.isDead,
		);

		// victim's chosen influence to kill
		newPlayers[loserIndex] = {
			...newPlayers[loserIndex],
			influences: newPlayers[loserIndex].influences.map((influence, index) => {
				if (index === influenceToKillIndex) {
					return {
						...influence,
						isDead: true,
					};
				}
				return influence;
			}),
		};

		if (challengeFailed) {
			const possibleInfluences = getInfluencesFromAction(action);
			const [{ type: revealedInfluence }] = winner.influences.filter(
				(influence) => possibleInfluences.indexOf(influence.type) !== -1,
			);

			const influenceToTradeIndex = newPlayers[winnerIndex].influences.findIndex(
				(influence) => influence.type === revealedInfluence && !influence.isDead,
			);

			newPlayers[winnerIndex] = {
				...newPlayers[winnerIndex],
				influences: newPlayers[winnerIndex].influences.map((influence, index) => {
					if (index === influenceToTradeIndex) {
						newDeck.push(influence.type);
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						const newInfluence = newDeck.shift()!;
						return { type: newInfluence, isDead: false };
					}
					return influence;
				}),
			};
		}

		return {
			actionToastProps: {
				variant: "Challenge",
				lostInfluence: killedInfluence,
				victimName: loser.name,
			},
			newDeck,
			newPlayers,
		};
	}
	// eslint-disable-next-line consistent-return
	return undefined;
}
