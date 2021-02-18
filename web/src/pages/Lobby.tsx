import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Center, Divider, FormControl, FormHelperText, Heading, Text, VStack } from "@chakra-ui/react";
import Header from "../components/Header";
import useDocTitle from "../hooks/useDocTitle";
import { useGameState } from "../contexts/GameStateContext/GameStateContext";
import Game from "./Game";

const Lobby: React.FC = () => {
  // use history module to push URLs
  const history = useHistory();

  const { roomCode } = useParams<{ roomCode: string }>();

  React.useEffect(() => {
    async function doesRoomExist() {
      const validRoom = await fetch(`/api/checkRoom?roomCode=${roomCode}`,
        {
          method: "GET",
        })
        .then((data) => data.json())
        .catch((err) => { throw Error(err); });
      if (!validRoom) history.push(`/`);
    }

    doesRoomExist();
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
              <Text key={player.name}>{player.name}</Text>
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
