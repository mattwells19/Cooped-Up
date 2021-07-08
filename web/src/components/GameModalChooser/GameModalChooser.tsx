import GameOverModal from "@components/Modals/GameOverModal";
import { IPlayer, useGameState } from "@contexts/GameStateContext";
import * as React from "react";
import ActionModalChooser from "./ModalChoosers/ActionModalChooser";
import ChallengerModalChooser from "./ModalChoosers/ChallengerModalChooser";

const GameModalChooser: React.FC = () => {
  const {
    action,
    blocker,
    currentStateMatches,
    challenger,
    currentPlayer,
    exchangeDetails,
    performer,
    victim,
    winningPlayer,
    handleGameEvent,
    handleActionResponse,
    blockingInfluence,
    killedInfluence,
  } = useGameState();

  // This ref is used to display the winning player if they happen to leave the game
  const winningPlayerRef = React.useRef<IPlayer | null>(null);

  React.useEffect(() => {
    if (winningPlayer) {
      winningPlayerRef.current = winningPlayer;
    }
  }, [winningPlayer]);

  if (currentStateMatches("game_over") && (winningPlayer || winningPlayerRef.current)) {
    return (
      <GameOverModal
        onPlayAgain={() => handleGameEvent({
          event: "PLAY_AGAIN",
        })}
        currentPlayer={currentPlayer}
        // Has to be one or the other because of the if statement above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        winner={winningPlayer ?? winningPlayerRef.current!}
      />
    );
  } else if (performer && action) {
    if ((currentStateMatches("challenged") || currentStateMatches("challenge_block")) && challenger) {
      return (
        <ChallengerModalChooser
          action={action}
          currentPlayer={currentPlayer}
          performer={performer}
          challenger={challenger}
          blockDetails={{ blocker, blockingInfluence }}
          handleGameEvent={handleGameEvent}
        />
      );
    } else {
      return (
        <ActionModalChooser
          action={action}
          blockDetails={{ blocker, blockingInfluence }}
          currentPlayer={currentPlayer}
          currentStateMatches={currentStateMatches}
          exchangeDetails={exchangeDetails}
          handleActionResponse={handleActionResponse}
          handleGameEvent={handleGameEvent}
          killedInfluence={killedInfluence}
          performer={performer}
          victim={victim}
        />
      );
    }
  } else {
    return <></>;
  }

};

export default GameModalChooser;
