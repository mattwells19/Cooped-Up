import { Actions } from "@contexts/GameStateContext";
import type { IActionToastProps } from "@hooks/useActionToast";
import usePlayerActions from "./usePlayerActions";
import type { ICurrentGameState, IGameStateRoles, ISendGameStateUpdate } from "../../types";
import { usePlayers } from "@contexts/PlayersContext";
import useActionToast from "@hooks/useActionToast";
import { useEffect } from "react";
import { useDeck } from "@contexts/DeckContext";

export default function useProcessPerformAction(
  currentGameState: ICurrentGameState,
  sendGameStateEvent: ISendGameStateUpdate,
  { performer, victim }: IGameStateRoles,
): void {
  const gameStateContext = currentGameState.context;
  const { setPlayers, getNextPlayerTurnId } = usePlayers();
  const { setDeck } = useDeck();
  const actionToast = useActionToast();
  const {
    performAidAction,
    performCoupAction,
    performIncomeAction,
    performStealAction,
    performTaxAction,
    performAssassinateAction,
    performExchangeAction,
  } = usePlayerActions(gameStateContext, performer, victim);

  useEffect(() => {
    if (!currentGameState.matches("perform_action")) return;

    const processAction = (): IActionToastProps | undefined => {
      if (!performer) throw new Error(`No performer found when performing ${gameStateContext.action}.`);

      switch (gameStateContext.action) {
        case Actions.Coup: {
          if (gameStateContext.killedInfluence) {
            setPlayers((prevPlayers) => performCoupAction(prevPlayers));

            if (!victim) throw new Error("No victim found when performing Coup.");

            return {
              lostInfluence: gameStateContext.killedInfluence,
              performerName: performer.name,
              variant: Actions.Coup,
              victimName: victim.name,
            };
          }
          break;
        }
        case Actions.Income: {
          setPlayers((prevPlayers) => performIncomeAction(prevPlayers));

          return {
            performerName: performer.name,
            variant: Actions.Income,
          };
        }
        case Actions.Tax: {
          setPlayers((prevPlayers) => performTaxAction(prevPlayers));

          return {
            performerName: performer.name,
            variant: Actions.Tax,
          };
        }
        case Actions.Aid: {
          setPlayers((prevPlayers) => performAidAction(prevPlayers));

          return {
            performerName: performer.name,
            variant: Actions.Aid,
          };
        }
        case Actions.Steal: {
          setPlayers((prevPlayers) => performStealAction(prevPlayers));

          if (!victim) throw new Error("No victim found when performing Steal.");

          return {
            performerName: performer.name,
            variant: Actions.Steal,
            victimName: victim.name,
          };
        }
        case Actions.Assassinate: {
          if (gameStateContext.killedInfluence) {
            setPlayers((prevPlayers) => performAssassinateAction(prevPlayers));

            if (!victim) throw new Error("No victim found when performing assassination.");

            return {
              lostInfluence: gameStateContext.killedInfluence,
              performerName: performer.name,
              variant: Actions.Assassinate,
              victimName: victim.name,
            };
          }
          break;
        }
        case Actions.Exchange: {
          const { exchangeDetails } = gameStateContext;
          if (exchangeDetails) {
            setPlayers((prevPlayers) => performExchangeAction(prevPlayers));

            setDeck((prevDeck) => {
              const newDeck = [...prevDeck];

              // remove the top two cards that were shown to the player
              newDeck.splice(0, 2);

              // add the deck cards to the back of the deck
              exchangeDetails.deck.forEach((playerInfluence) => {
                newDeck.push(playerInfluence.type);
              });
              return newDeck;
            });

            return {
              performerName: performer.name,
              variant: Actions.Exchange,
            };
          }
          break;
        }
        default:
          throw new Error(`The action ${gameStateContext.action} either does not exist or is not implemented yet.`);
      }
    };

    const actionToastProps = processAction();

    if (actionToastProps) {
      actionToast(actionToastProps);
      sendGameStateEvent("COMPLETE", {
        nextPlayerTurnId: getNextPlayerTurnId(gameStateContext.playerTurnId),
      });
    }
  }, [currentGameState.value, gameStateContext.killedInfluence, gameStateContext.exchangeDetails]);
}
