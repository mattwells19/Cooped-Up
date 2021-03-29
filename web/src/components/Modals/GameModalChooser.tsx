import { useGameState } from "@contexts/GameStateContext/GameStateContext";
import { Actions } from "@contexts/GameStateContext/types";
import { getPlayerById, getPlayersByIds } from "@utils/GameState/helperFns";
import * as React from "react";
import ActionProposedModal from "./ActionProposedModal";
import ChallengedModal from "./ChallengedModal";
import LoseInfluenceModal from "./LoseInfluenceModal";
import WaitingForActionModal from "./WaitingForActionModal";

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

  if (challenger && performer) {
    return (
      <ChallengedModal performer={performer} challenger={challenger} onDone={() => null} />
    );
  }
  if (action === Actions.Coup && performer && victim) {
    return currentPlayer.id === victim.id ? (
      // current player being coup'd
      <LoseInfluenceModal
        performer={performer}
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
  if (action === Actions.Tax && performer) {
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
        action="collect tax"
        performer={performer}
        handleClose={handleActionResponse}
      />
    );
  }
  // idle
  return <></>;
};

export default GameModalChooser;
