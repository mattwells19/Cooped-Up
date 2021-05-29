import GameOverModal from "@components/Modals/GameOverModal";
import { Actions, useGameState } from "@contexts/GameStateContext";
import { usePlayers } from "@contexts/PlayersContext";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";
import * as React from "react";
import ActionProposedModal from "../Modals/ActionProposedModal";
import LoseInfluenceModal from "../Modals/LoseInfluenceModal";
import WaitingForActionModal from "../Modals/WaitingForActionModal";
import ModalWithChallenger from "./ModalWithChallenger";

const GameModalChooser: React.FC = () => {
  const {
    action,
    blockerId,
    challengerId,
    currentPlayerId,
    performerId,
    victimId,
    winningPlayerId,
    blockingInfluence,
    handleGameEvent,
    handleActionResponse,
  } = useGameState();

  const { getPlayersByIds } = usePlayers();

  const [
    currentPlayer,
    performer,
    victim,
    challenger,
    blocker,
    winningPlayer,
  ] = getPlayersByIds([
    currentPlayerId,
    performerId,
    victimId,
    challengerId,
    blockerId,
    winningPlayerId
  ]).map((p) => p?.player);
  
  if (!currentPlayer) throw new PlayerNotFoundError(currentPlayerId);

  if (winningPlayer) {
    return (
      <GameOverModal
        onPlayAgain={() => handleGameEvent({
          event: "PLAY_AGAIN",
        })}
        currentPlayer={currentPlayer}
        winner={winningPlayer}
      />
    );
  }

  // If there is no performer or action, then there's no other modal to show.
  if (!performer || !action) return <></>;

  if (challenger) 
    return (
      <ModalWithChallenger
        action={action}
        challenger={challenger}
        blockDetails={{ blocker, blockingInfluence }}
        handleGameEvent={handleGameEvent}
        currentPlayer={currentPlayer}
        performer={performer}
      />
    );

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

export default GameModalChooser;
