import { Actions, IActionResponse, IGameState, Influence, IPlayer } from "@contexts/GameStateContext";
import * as React from "react";
import ActionProposedModal from "../../Modals/ActionProposedModal";
import LoseInfluenceModal from "../../Modals/LoseInfluenceModal";
import WaitingForActionModal from "../../Modals/WaitingForActionModal";

interface IActionModalChooserProps {
  action: Actions;
  currentPlayer: IPlayer;
  performer: IPlayer;
  victim: IPlayer | undefined;
  blockDetails: { blocker: IPlayer | undefined, blockingInfluence: Influence | undefined };
  handleGameEvent: (newGameState: IGameState) => void;
  handleActionResponse: (response: IActionResponse) => void;
}

const ActionModalChooser: React.FC<IActionModalChooserProps> = ({
  action,
  currentPlayer,
  performer,
  victim,
  blockDetails,
  handleGameEvent,
  handleActionResponse,
}) => {
  const { blocker, blockingInfluence } = blockDetails;

  // Determine which modal to show during a coup.
  if (action === Actions.Coup && victim) {
    return currentPlayer.id === victim.id ? (
      // current player being coup'd
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
      // some other player being coup'd
      <WaitingForActionModal
        messaging={[
          `${performer.name} has chosen to ${action} ${victim.name}.`,
          `Waiting for ${victim.name} to choose an Influence to lose.`,
        ]}
      />
    );
  }

  // every other action can be blocked/challenged
  if (action !== Actions.Coup && action !== Actions.Income) {
    return currentPlayer.actionResponse && currentPlayer.actionResponse.type === "PASS" ? (
      // player decided not to challenge
      <WaitingForActionModal messaging={["You have chosen to pass.", "Waiting for all players to pass/challenge..."]} />
    ) : (
      // player given the option to challenge
      <ActionProposedModal
        action={action}
        blockDetails={{ blocker, blockingInfluence }}
        currentPlayer={currentPlayer}
        performer={performer}
        victim={victim}
        handleClose={handleActionResponse}
      />
    );
  }

  // handles any unforseen cases
  return <></>;
};

export default ActionModalChooser;
