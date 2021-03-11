import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Center, Divider, FormControl, FormHelperText, Heading, Text, VStack } from "@chakra-ui/react";
import Header from "../components/Header";
import useDocTitle from "../hooks/useDocTitle";
import { useGameState } from "../contexts/GameStateContext/GameStateContext";
import Game from "./Game";
import get from "../utils/get";

interface ILobbyProps {
  newRoom: boolean | undefined;
  roomCode: string;
}

const Lobby: React.FC<ILobbyProps> = ({ newRoom, roomCode }) => {
  // use history module to push URLs
  const history = useHistory();

  React.useEffect(() => {
    async function doesRoomExist() {
      const validRoom = await get<boolean>(`checkRoom?roomCode=${roomCode}`);

      if (!validRoom) {
        history.push({
          pathname: `/`,
          state: {
            invalidRoomCode: true,
          },
        });
      }
    }

    if (!newRoom) doesRoomExist();
  }, []);

  useDocTitle(`Lobby - ${roomCode}`);

  const { players, gameStarted, handleStartGame } = useGameState();

  if (gameStarted) return <Game />;
  return (
    <>
      <Header>{roomCode}</Header>
      <Center marginTop="10">
        <VStack alignItems="flex-start">
          <Heading as="h2">Players</Heading>
          <Divider />
          <VStack height="20rem" alignItems="flex-start" overflowY="auto" width="100%">
            {players.map((player) => (
              <Text key={player.id}>{player.name}</Text>
            ))}
          </VStack>
          <FormControl display="flex" flexDirection="column">
            <Button
              alignSelf="center"
              disabled={players.length < 3 || players.length > 8}
              onClick={() => handleStartGame()}
              size="lg"
            >
              Start Game
            </Button>
            {players.length < 3 && <FormHelperText>Need at least 3 players to start the game.</FormHelperText>}
            {players.length > 8 && <FormHelperText>Can only support a maximum of 8 players.</FormHelperText>}
          </FormControl>
        </VStack>
      </Center>
    </>
  );
};

export default Lobby;
