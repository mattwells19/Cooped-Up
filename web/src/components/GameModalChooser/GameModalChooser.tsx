import GameOverModal from "@components/Modals/GameOverModal";
import { IPlayer, useGameState } from "@contexts/GameStateContext";
import { usePlayers } from "@contexts/PlayersContext";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";
import * as React from "react";
import ActionModalChooser from "./ModalChoosers/ActionModalChooser";
import ChallengerModalChooser from "./ModalChoosers/ChallengerModalChooser";

const GameModalChooser: React.FC = () => {
  const {
    action,
    blockerId,
    challengerId,
    currentPlayerId,
    performerId,
    victimId,
    winningPlayerId,
    handleGameEvent,
    handleActionResponse,
    blockingInfluence,
  } = useGameState();

  const { getPlayersByIds } = usePlayers();

  const [
    blocker,
    currentPlayer,
    performer,
    challenger,
    victim,
    winningPlayer,
  ] = getPlayersByIds([
    blockerId,
    currentPlayerId,
    performerId,
    challengerId,
    victimId,
    winningPlayerId
  ]).map((p) => p?.player);

  // This ref is used to display the winning player if they happen to leave the game
  const winningPlayerRef = React.useRef<IPlayer | null>(null);

  if (!currentPlayer) throw new PlayerNotFoundError(currentPlayerId);

  React.useEffect(() => {
    if (winningPlayer) {
      winningPlayerRef.current = winningPlayer;
    }
  }, [winningPlayer]);

  if (winningPlayer || winningPlayerRef.current) {
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
    if (challenger) {
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
          currentPlayer={currentPlayer}
          performer={performer}
          victim={victim}
          blockDetails={{ blocker, blockingInfluence }}
          handleGameEvent={handleGameEvent}
          handleActionResponse={handleActionResponse}
        />
      );
    }
  } else {
    return <></>;
  }

};

export default GameModalChooser;
