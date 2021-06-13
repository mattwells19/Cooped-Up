import ChallengedModal from "@components/Modals/ChallengedModal";
import LoseInfluenceModal from "@components/Modals/LoseInfluenceModal";
import WaitingForActionModal from "@components/Modals/WaitingForActionModal";
import type { Actions, IGameState, Influence, IPlayer } from "@contexts/GameStateContext";
import { getInfluenceFromAction, wasValidAction } from "@utils/InfluenceUtils";
import * as React from "react";

interface IChallengerModalChooserProps {
  action: Actions;
  currentPlayer: IPlayer;
  performer: IPlayer;
  challenger: IPlayer;
  blockDetails: { blocker: IPlayer | undefined, blockingInfluence: Influence | undefined };
  handleGameEvent: (newGameState: IGameState) => void;
}

const ChallengerModalChooser: React.FC<IChallengerModalChooserProps> = ({
  action,
  currentPlayer,
  performer,
  challenger,
  handleGameEvent,
  blockDetails,
}) => {
  const { blocker, blockingInfluence } = blockDetails;
  
  const [challengeResult, setChallengeResult] = React.useState<"success" | "failed" | null>(null);
  
  React.useEffect(() => {
    setChallengeResult(null);
  }, [action]);

  // once the result has been shown, it's time for the loser to pick an influence to lose
  if (challengeResult) {
    const aliveInfluences = (challengeResult === "failed" ? challenger : blocker ?? performer).influences.filter(
      (influence) => !influence.isDead,
    );
      
    // auto select the influence if the player has only one influence remaining
    if (aliveInfluences.length === 1) {
      setChallengeResult(null);
      handleGameEvent({
        event: "LOSE_INFLUENCE",
        eventPayload: {
          challengeFailed: challengeResult === "failed",
          killedInfluence: aliveInfluences[0].type,
        },
      });

      return <></>;
    } else if (
      // determine if the current player is the one choosing an influence to lose.
      // Includes challenger, performer, and blocker
      (challengeResult === "failed" && currentPlayer.id === challenger.id) ||
      (challengeResult === "success"
        && ((blocker && currentPlayer.id === blocker.id) || (!blocker && currentPlayer.id === performer.id)))
    ) {
      return (
        <LoseInfluenceModal
          currentPlayer={currentPlayer}
          handleClose={(influenceToLose) => {
            setChallengeResult(null);
            handleGameEvent({
              event: "LOSE_INFLUENCE",
              eventPayload: {
                challengeFailed: challengeResult === "failed",
                killedInfluence: influenceToLose,
              },
            });
          }}
        />
      );
    } else {
      // if current player is not the one choosing an influence to lose
      const success = challengeResult === "success";
      return (
        <WaitingForActionModal
          messaging={[
            `${challenger.name}'s challenge against ${performer.name} ${success ? "was successful" : "failed"}.`,
            `Waiting for ${success ? performer.name : challenger.name} to choose an Influence to lose.`,
          ]}
        />
      );
    }
  } else if (blocker && blockingInfluence) {
    // determine result when challenging someone who is trying to block an action
    const challengeFailed = blocker.influences
      .filter((influence) => !influence.isDead)
      .some((influence) => blockingInfluence === influence.type);

    return (
      <ChallengedModal
        performer={blocker}
        challenger={challenger}
        challengedInfluence={blockingInfluence}
        challengeFailed={challengeFailed}
        onDone={() => setChallengeResult(challengeFailed ? "failed" : "success")}
      />
    );
  } else {
    // determine result when challenging an action
    const challengeFailed = performer.influences
      .filter((influence) => !influence.isDead)
      .some((influence) => wasValidAction(influence.type, action));

    const challengedAction = getInfluenceFromAction(action);
    if (!challengedAction) throw new Error(`A non-challengable action was challenged: ${challengedAction}.`);

    return (
      <ChallengedModal
        performer={performer}
        challenger={challenger}
        challengedInfluence={challengedAction}
        challengeFailed={challengeFailed}
        onDone={() => setChallengeResult(challengeFailed ? "failed" : "success")}
      />
    );
  }
};

export default ChallengerModalChooser;
