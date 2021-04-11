/* eslint-disable indent */
// Another issue with switch case indent

import { Actions, IPlayer } from "@contexts/GameStateContext";
import type { IActionToastProps } from "@hooks/useActionToast";
import { CoupAction, IncomeAction, TaxAction } from "./Actions";
import type { ICurrentGameState } from "./types";
import type { Dispatch, SetStateAction } from "react";
import type { IFindPlayerByIdResponse } from "@contexts/PlayersContext";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";

export default function processPerformAction(
	currentGameState: ICurrentGameState,
	setPlayers: Dispatch<SetStateAction<Array<IPlayer>>>,
	getPlayerById: (playerId: string) => IFindPlayerByIdResponse,
): IActionToastProps {
	switch (currentGameState.context.action) {
		case Actions.Coup: {
			if (!currentGameState.context.killedInfluence) throw new Error("No influence was selected to eliminate.");

			setPlayers((prevPlayers) => CoupAction(prevPlayers, currentGameState.context, getPlayerById));
			const performer = getPlayerById(currentGameState.context.performerId)?.player;
			const victim = getPlayerById(currentGameState.context.victimId)?.player;

			if (!performer) throw new PlayerNotFoundError(currentGameState.context.performerId);
			if (!victim) throw new PlayerNotFoundError(currentGameState.context.victimId);

			return {
				performerName: performer.name,
				victimName: victim.name,
				variant: Actions.Coup,
				lostInfluence: currentGameState.context.killedInfluence,
			};
		}
		case Actions.Income: {
			setPlayers((prevPlayers) => IncomeAction(prevPlayers, currentGameState.context, getPlayerById));
			const performer = getPlayerById(currentGameState.context.playerTurnId)?.player;
			if (!performer) throw new PlayerNotFoundError(currentGameState.context.playerTurnId);

			return {
				performerName: performer.name,
				variant: Actions.Income,
			};
		}
		case Actions.Tax: {
			setPlayers((prevPlayers) => TaxAction(prevPlayers, currentGameState.context, getPlayerById));
			const performer = getPlayerById(currentGameState.context.performerId)?.player;

			if (!performer) throw new PlayerNotFoundError(currentGameState.context.performerId);

			return {
				performerName: performer.name,
				variant: Actions.Tax,
			};
		}
		default:
			throw new Error(`The action ${currentGameState.context.action} either does not exist or is not implemented yet.`);
	}
}
