import * as React from "react";
import { Wrap, WrapItem, HStack, Box } from "@chakra-ui/react";
import { useGameState } from "@contexts/GameStateContext/GameStateContext";
import PlayerHand from "@components/PlayerHand";
import Actions from "@components/Actions/Actions";
import GameModalChooser from "@components/GameModalChooser";
import { usePlayers } from "@contexts/PlayersContext";

const Game: React.FC = () => {
  const { currentPlayer } = useGameState();
  const { players } = usePlayers();
  const otherPlayers = players.filter((player) => player.id.localeCompare(currentPlayer.id) !== 0);

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
