import * as React from "react";
import { Wrap, WrapItem, HStack, Box } from "@chakra-ui/react";
import { useGameState } from "../contexts/GameStateContext/GameStateContext";
import { Actions as InfluenceActions } from "../contexts/GameStateContext/types";
import PlayerHand from "../components/PlayerHand";
import Actions from "../components/Actions/Actions";
import LoseInfluenceModal from "../components/LoseInfluenceModal";
import WaitingForActionModal from "../components/WaitingForActionModal";
import { getPlayerById } from "../contexts/GameStateContext/Actions";

interface IGameProps {}

const Game: React.FC<IGameProps> = () => {
  const { currentPlayerId, players, action, victimId, performerId, handleGameEvent } = useGameState();

  const currentPlayer = getPlayerById(players, currentPlayerId).player;
  if (!currentPlayer) throw new Error(`No player was found with the id ${currentPlayerId}.`);

  const otherPlayers = players.filter((player) => player.id.localeCompare(currentPlayerId) !== 0);

  const performer = getPlayerById(players, performerId).player;
  const victim = getPlayerById(players, victimId).player;

  return (
    <>
      <Box height="100vh" paddingTop="20">
        <Wrap justify="center" spacing="60px" maxWidth="90%" margin="auto">
          {otherPlayers.map((player) => (
            <WrapItem key={player.name}>
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
        <WaitingForActionModal action="coup" performer={performer} playerWaitingOn={victim} />
      )}
    </>
  );
};

export default Game;
