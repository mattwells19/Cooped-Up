import * as React from "react";
import { Wrap, WrapItem, HStack, Box } from "@chakra-ui/react";
import { useGameState } from "@contexts/GameStateContext/GameStateContext";
import { Actions as InfluenceActions } from "@contexts/GameStateContext/types";
import PlayerHand from "@components/PlayerHand";
import ActionProposedModal from "@components/Modals/ActionProposedModal";
import ChallengedModal from "@components/Modals/ChallengedModal";
import Actions from "@components/Actions/Actions";
import LoseInfluenceModal from "@components/Modals/LoseInfluenceModal";
import WaitingForActionModal from "@components/Modals/WaitingForActionModal";
import { getPlayerById } from "@utils/GameState/Actions";

interface IGameProps {}

const Game: React.FC<IGameProps> = () => {
  const { currentPlayerId,
    players,
    action,
    challengerId,
    victimId,
    performerId,
    handleGameEvent,
    handleActionResponse } = useGameState();

  const currentPlayer = getPlayerById(players, currentPlayerId).player;
  if (!currentPlayer) throw new Error(`No player was found with the id ${currentPlayerId}.`);

  const otherPlayers = players.filter((player) => player.id.localeCompare(currentPlayerId) !== 0);

  const performer = getPlayerById(players, performerId).player;
  const victim = getPlayerById(players, victimId).player;
  const challenger = challengerId ? getPlayerById(players, challengerId).player : undefined;

  return (
    <>
      <Box height="100vh" paddingTop="20">
        <Wrap justify="center" spacing="60px" maxWidth="90%" margin="auto">
          {otherPlayers.map((player) => (
            <WrapItem key={player.id}>
              <PlayerHand player={player} />
            </WrapItem>
          ))}
        </Wrap>
        <HStack bottom="20" position="absolute" spacing="60px" width="100%" justifyContent="center">
          <PlayerHand player={currentPlayer} isCurrentPlayer />
          <Actions otherPlayers={otherPlayers} />
        </HStack>
      </Box>
      {action === InfluenceActions.Coup && victimId === currentPlayerId && performer && currentPlayer && (
        <LoseInfluenceModal
          performer={performer}
          currentPlayer={currentPlayer}
          handleClose={(influenceToLose) => handleGameEvent({
            event: "PASS",
            eventPayload: {
              killedInfluence: influenceToLose,
            },
          })}
        />
      )}
      {action === InfluenceActions.Coup && victimId !== currentPlayerId && performer && victim && (
        <WaitingForActionModal
          messaging={[
            `${performer.name} has chosen to ${action} ${victim.name}.`,
            `Waiting for ${victim.name} to choose an Influence to lose.`,
          ]}
        />
      )}
      {action === InfluenceActions.Tax && !challenger && currentPlayer.actionResponse === "PASS" && (
        <WaitingForActionModal
          messaging={[
            "You have chosen to pass.",
            "Waiting for all players to pass/challenge...",
          ]}
        />
      )}
      {(action === InfluenceActions.Tax
        && !challenger
        && performerId !== currentPlayerId
        && performer
        && !currentPlayer.actionResponse
      ) && (
        <ActionProposedModal action="collect tax" performer={performer!} handleClose={handleActionResponse} />
      )}
      {(challenger && performer) && (
        <ChallengedModal performer={performer!} challenger={challenger} onDone={() => null} />
      )}
    </>
  );
};

export default Game;
