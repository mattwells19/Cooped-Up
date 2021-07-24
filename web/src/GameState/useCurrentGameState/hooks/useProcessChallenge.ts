import { useDeck } from "@contexts/DeckContext";
import type { Influence, IPlayer } from "@contexts/GameStateContext";
import { usePlayers } from "@contexts/PlayersContext";
import { ActionDetails } from "@utils/ActionUtils";
import { getInfluenceFromAction } from "@utils/InfluenceUtils";
import type { ICurrentGameState, IGameStateRoles, ISendGameStateUpdate } from "../../types";
import useActionToast from "@hooks/useActionToast";
import { useEffect } from "react";

export default function useProcessChallenge(
  currentGameState: ICurrentGameState,
  sendGameStateEvent: ISendGameStateUpdate,
  { blocker, performer, challenger }: IGameStateRoles,
): void {
  const gameStateContext = currentGameState.context;
  const { players, setPlayers, getNextPlayerTurnId } = usePlayers();
  const { deck, setDeck } = useDeck();
  const actionToast = useActionToast();

  useEffect(() => {
    if (gameStateContext.challengeFailed === undefined) return;

    if (currentGameState.matches("challenged")) {
      if (!performer) throw new Error("No performer found when processing challenge.");
      if (!challenger) throw new Error("No challenger found when processing challenge.");

      const killedInfluence = gameStateContext.killedInfluence;
      if (killedInfluence === "NO_INFLUENCES_LEFT") {
        throw new Error("Tried to use NO_INFLUENCES_LEFT during a challenge which is not allowed.");
      }

      const loser = gameStateContext.challengeFailed ? challenger : performer;
      const winner = gameStateContext.challengeFailed ? performer : challenger;

      const newPlayers: Array<IPlayer> = players.map((player) => ({ ...player, actionResponse: null }));
      const newDeck: Array<Influence> = [...deck];

      const influenceToKillIndex = newPlayers[loser.index].influences.findIndex(
        (influence) => influence.type === killedInfluence && !influence.isDead,
      );

      // victim's chosen influence to kill
      newPlayers[loser.index] = {
        ...newPlayers[loser.index],
        influences: newPlayers[loser.index].influences.map((influence, index) => {
          if (index === influenceToKillIndex) {
            return {
              ...influence,
              isDead: true,
            };
          }
          return influence;
        }),
      };

      if (gameStateContext.challengeFailed) {
        const action = gameStateContext.action;
        if (!action) throw new Error("Action cannot be null when challenging.");
        const validInfluence = getInfluenceFromAction(action);

        const influenceToReveal = winner.influences.find((influence) => validInfluence === influence.type);
        if (!influenceToReveal)
          throw new Error(
            `The chosen influence as a result of the failed challenge is not in the losers hand: ${influenceToReveal}.`,
          );

        const influenceToTradeIndex = newPlayers[winner.index].influences.findIndex(
          (influence) => influence.type === influenceToReveal.type && !influence.isDead,
        );

        newPlayers[winner.index] = {
          ...newPlayers[winner.index],
          influences: newPlayers[winner.index].influences.map((influence, index) => {
            if (index === influenceToTradeIndex) {
              newDeck.push(influence.type);
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const newInfluence = newDeck.shift()!;
              return { isDead: false, type: newInfluence };
            }
            return influence;
          }),
        };
      }

      setPlayers(newPlayers);
      setDeck(newDeck);
      actionToast({
        lostInfluence: killedInfluence,
        variant: "Challenge" as const,
        victimName: loser.name,
      });

      if (gameStateContext.challengeFailed) sendGameStateEvent("FAILED");
      else {
        sendGameStateEvent("COMPLETE", {
          nextPlayerTurnId: getNextPlayerTurnId(gameStateContext.playerTurnId),
        });
      }
    } else if (currentGameState.matches("challenge_block")) {
      if (!blocker) throw new Error("No blocker found when processing challenge.");
      if (!challenger) throw new Error("No challenger found when processing challenge.");

      const killedInfluence = gameStateContext.killedInfluence;
      if (killedInfluence === "NO_INFLUENCES_LEFT") {
        throw new Error("Tried to use NO_INFLUENCES_LEFT during a challenge which is not allowed.");
      }

      const loser = gameStateContext.challengeFailed ? challenger : blocker;
      const winner = gameStateContext.challengeFailed ? blocker : challenger;

      const newPlayers: Array<IPlayer> = players.map((player) => ({ ...player, actionResponse: null }));
      const newDeck = [...deck];

      const influenceToKillIndex = newPlayers[loser.index].influences.findIndex(
        (influence) => influence.type === killedInfluence && !influence.isDead,
      );

      // victim's chosen influence to kill
      newPlayers[loser.index] = {
        ...newPlayers[loser.index],
        influences: newPlayers[loser.index].influences.map((influence, index) => {
          if (index === influenceToKillIndex) {
            return {
              ...influence,
              isDead: true,
            };
          }
          return influence;
        }),
      };

      if (gameStateContext.challengeFailed) {
        const action = gameStateContext.action;
        if (!action) throw new Error("Action cannot be null when challenging.");
        const possibleInfluences = ActionDetails[action].blockable ?? [];

        const [{ type: revealedInfluence }] = winner.influences.filter(
          (influence) => possibleInfluences.indexOf(influence.type) !== -1,
        );

        const influenceToTradeIndex = newPlayers[winner.index].influences.findIndex(
          (influence) => influence.type === revealedInfluence && !influence.isDead,
        );

        newPlayers[winner.index] = {
          ...newPlayers[winner.index],
          influences: newPlayers[winner.index].influences.map((influence, index) => {
            if (index === influenceToTradeIndex) {
              newDeck.push(influence.type);
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const newInfluence = newDeck.shift()!;
              return { isDead: false, type: newInfluence };
            }
            return influence;
          }),
        };
      }

      setPlayers(newPlayers);
      setDeck(newDeck);
      actionToast({
        lostInfluence: killedInfluence,
        variant: "Challenge",
        victimName: loser.name,
      });

      if (gameStateContext.challengeFailed)
        sendGameStateEvent("CHALLENGE_BLOCK_FAILED", {
          nextPlayerTurnId: getNextPlayerTurnId(gameStateContext.playerTurnId),
        });
      else sendGameStateEvent("COMPLETE");
    }
  }, [currentGameState.value, gameStateContext.challengeFailed]);
}
