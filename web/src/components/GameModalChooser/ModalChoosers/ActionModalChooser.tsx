import { Actions, IActionResponse, IGameState, Influence, IPlayer } from "@contexts/GameStateContext";
import type { GameStateMachineStateOptions } from "@GameState/GameStateMachine";
import type { IGameStateExchangeDetails } from "@GameState/types";
import * as React from "react";
import ActionProposedModal from "../../Modals/ActionProposedModal";
import LoseInfluenceModal from "../../Modals/LoseInfluenceModal";
import WaitingForActionModal from "../../Modals/WaitingForActionModal";
import ExchangeModal from "@components/Modals/ExchangeModal";
import Bold from "@components/Bold";
import { Text } from "@chakra-ui/react";
import { ActionDetails } from "@utils/ActionUtils";

interface IActionModalChooserProps {
  action: Actions;
  currentPlayer: IPlayer;
  performer: IPlayer;
  exchangeDetails: IGameStateExchangeDetails | undefined;
  victim: IPlayer | undefined;
  currentStateMatches: (state: GameStateMachineStateOptions) => boolean;
  killedInfluence: Influence | "NO_INFLUENCES_LEFT" | undefined;
  blockDetails: { blocker: IPlayer | undefined, blockingInfluence: Influence | undefined };
  handleGameEvent: (newGameState: IGameState) => void;
  handleActionResponse: (response: IActionResponse) => void;
}

const ActionModalChooser: React.FC<IActionModalChooserProps> = ({
  action,
  currentPlayer,
  currentStateMatches,
  exchangeDetails,
  performer,
  victim,
  blockDetails,
  handleGameEvent,
  killedInfluence,
  handleActionResponse,
}) => {
  const { blocker, blockingInfluence } = blockDetails;

  if (
    currentStateMatches("perform_action")
    && action === Actions.Exchange
    && !exchangeDetails
  ) {
    return currentPlayer.id === performer.id ? (
      <ExchangeModal
        currentPlayer={currentPlayer}
        handleClose={(playerHand, deck) =>
          handleGameEvent({
            event: "PASS",
            eventPayload: { exchangeDetails: { deck, playerHand } },
          })
        }
      />
    ) : (
      <WaitingForActionModal>
        <Text>
          <Bold>{performer.name}</Bold>
          {" has chosen to "}
          <Bold color={ActionDetails[action].color}>{action}</Bold>
          .
        </Text>
        <Text>
          {"Waiting for "}
          <Bold>{performer.name}</Bold>
          {" to finish their selections."}
        </Text>
      </WaitingForActionModal>
    );
  }
  // Prompt victim to choose an influence to kill
  else if (
    currentStateMatches("perform_action")
    && (action === Actions.Coup || action === Actions.Assassinate) 
    && !killedInfluence && victim
  ) {

    // auto-select influence if there's only one left alive
    const victimAliveInfluences = victim.influences.filter((influence) => !influence.isDead);

    // it's possible that a player being assassinated can lost a challenge and lose their last influence before
    // processing the assassination. If that happens, just complete the action and move on.
    if (victimAliveInfluences.length === 0) {
      handleGameEvent({
        event: "PASS",
        eventPayload: { killedInfluence: "NO_INFLUENCES_LEFT" },
      });

      return <></>;
    } else if (victimAliveInfluences.length === 1) {
      handleGameEvent({
        event: "PASS",
        eventPayload: { killedInfluence: victimAliveInfluences[0].type },
      });

      return <></>;
    } else {
      return currentPlayer.id === victim.id ? (
        <LoseInfluenceModal
          currentPlayer={currentPlayer}
          handleClose={(influenceToLose) =>
            handleGameEvent({
              event: "PASS",
              eventPayload: { killedInfluence: influenceToLose },
            })
          }
        />
      ) : (
        <WaitingForActionModal>
          <Text>
            <Bold>{performer.name}</Bold>
            {" has chosen to "}
            <Bold color={ActionDetails[action].color}>{action}</Bold>
            &nbsp;
            <Bold>{victim.name}</Bold>
            .
          </Text>
          <Text>
            {"Waiting for "}
            <Bold>{victim.name}</Bold>
            {" to choose an influence to lose."}
          </Text>
        </WaitingForActionModal>
      );
    }

  }

  else if (action !== Actions.Coup && action !== Actions.Income) {
    return (
      <ActionProposedModal
        action={action}
        blockDetails={{ blocker, blockingInfluence }}
        currentPlayer={currentPlayer}
        performer={performer}
        victim={victim}
        handleClose={handleActionResponse}
        hasPassed={currentPlayer.actionResponse?.type === "PASS"}
      />
    );
  }

  // handles any unforseen cases
  else return <></>;
};

export default ActionModalChooser;
