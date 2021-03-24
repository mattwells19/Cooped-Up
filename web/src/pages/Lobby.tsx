import React from "react";
import { useHistory, Link } from "react-router-dom";
import {
  Button, Divider, FormControl,
  FormHelperText, Heading, Text, VStack,
  ButtonGroup, Center, useToast,
} from "@chakra-ui/react";
import Header from "../components/Header";
import useDocTitle from "../hooks/useDocTitle";
import { useGameState } from "../contexts/GameStateContext/GameStateContext";
import Game from "./Game";
import get from "../utils/get";
import type { IPlayer } from "../contexts/GameStateContext/types";

interface ILobbyProps {
  newRoom: boolean | undefined;
  roomCode: string;
}

const Lobby: React.FC<ILobbyProps> = ({ newRoom, roomCode }) => {
  // use history module to push URLs
  const history = useHistory();
  const toast = useToast();

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
  const prevPlayersRef = React.useRef<Array<IPlayer>>(players);

  React.useEffect(() => {
    const prevPlayers = prevPlayersRef.current;

    prevPlayersRef.current = players;
    if (prevPlayers > players) {
      const playerIds = players.map(({ id }) => id);
      const prevPlayersIds = prevPlayers.map(({ name }) => name);
      const playerLeft = prevPlayersIds.filter((x) => playerIds.indexOf(x) === -1).toString();
      toast({
        title: `${playerLeft} has disconnected.`,
        status: "info",
        duration: 5000,
        isClosable: false,
        position: "top-right",
      });
    }
  }, [players]);

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
            <ButtonGroup direction="row" spacing={4}>
              <Button
                size="lg"
                variant="outline"
              >
                <Link to="/">Leave Lobby</Link>
              </Button>
              <Button
                disabled={players.length < 3 || players.length > 8}
                onClick={() => handleStartGame()}
                size="lg"
              >
                Start Game
              </Button>
            </ButtonGroup>
            <Center>
              {players.length < 3 && <FormHelperText>Need at least 3 players to start the game.</FormHelperText>}
              {players.length > 8 && <FormHelperText>Can only support a maximum of 8 players.</FormHelperText>}
            </Center>
          </FormControl>
        </VStack>
      </Center>
    </>
  );
};

export default Lobby;
