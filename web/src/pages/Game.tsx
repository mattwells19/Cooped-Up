import * as React from "react";
import { Wrap, WrapItem, HStack, Box } from "@chakra-ui/react";
import { useGameState } from "@contexts/GameStateContext/GameStateContext";
import PlayerHand from "@components/PlayerHand";
import Actions from "@components/Actions/Actions";
import { getPlayerById } from "@utils/GameState/helperFns";
import GameModalChooser from "@components/Modals/GameModalChooser";

interface IGameProps {}

const Game: React.FC<IGameProps> = () => {
  const { currentPlayerId, players } = useGameState();

  const currentPlayer = getPlayerById(players, currentPlayerId).player;
  if (!currentPlayer) throw new Error(`No player was found with the id ${currentPlayerId}.`);

  const otherPlayers = players.filter((player) => player.id.localeCompare(currentPlayerId) !== 0);

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
      <GameModalChooser />
    </>
  );
};

export default Game;
