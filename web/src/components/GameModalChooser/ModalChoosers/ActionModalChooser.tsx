import { Actions, IActionResponse, IGameState, Influence, IPlayer } from "@contexts/GameStateContext";
import { usePlayers } from "@contexts/PlayersContext";
import type { GameStateMachineStateOptions } from "@GameState/GameStateMachine";
import * as React from "react";
import ActionProposedModal from "../../Modals/ActionProposedModal";
import LoseInfluenceModal from "../../Modals/LoseInfluenceModal";
import WaitingForActionModal from "../../Modals/WaitingForActionModal";

interface IActionModalChooserProps {
  action: Actions;
  currentPlayer: IPlayer;
  performer: IPlayer;
  victim: IPlayer | undefined;
  currentStateMatches: (state: GameStateMachineStateOptions) => boolean;
  killedInfluence: Influence | undefined;
  blockDetails: { blocker: IPlayer | undefined, blockingInfluence: Influence | undefined };
  handleGameEvent: (newGameState: IGameState) => void;
  handleActionResponse: (response: IActionResponse) => void;
}

const ActionModalChooser: React.FC<IActionModalChooserProps> = ({
  action,
  currentPlayer,
  currentStateMatches,
  performer,
  victim,
  blockDetails,
  handleGameEvent,
  killedInfluence,
  handleActionResponse,
}) => {
  const { blocker, blockingInfluence } = blockDetails;
  const { getNextPlayerTurnId } = usePlayers();

  // Prompt victim to choose an influence to kill
  if (
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
        event: "COMPLETE",
        eventPayload: { nextPlayerTurnId: getNextPlayerTurnId(currentPlayer.id) },
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
        <WaitingForActionModal
          messaging={[
            `${performer.name} has chosen to ${action} ${victim.name}.`,
            `Waiting for ${victim.name} to choose an Influence to lose.`,
          ]}
        />
      );
    }

  }

  else if (action !== Actions.Coup && action !== Actions.Income) {
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
  else return <></>;
};

export default ActionModalChooser;
