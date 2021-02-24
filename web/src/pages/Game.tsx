import * as React from "react";
import { Wrap, WrapItem, HStack, Box } from "@chakra-ui/react";
import { useGameState } from "../contexts/GameStateContext/GameStateContext";
import PlayerHand from "../components/PlayerHand";
import Actions from "../components/Actions";

interface IGameProps {}

const Game: React.FC<IGameProps> = () => {
  const { currentPlayerName, players } = useGameState();

  const currentPlayer = players.find((player) => player.name.localeCompare(currentPlayerName) === 0);
  if (!currentPlayer) throw Error("Current player not found in players.");

  const otherPlayers = players.filter((player) => player.name.localeCompare(currentPlayerName) !== 0);

  return (
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
        <Actions />
      </HStack>
    </Box>
  );
};

export default Game;
