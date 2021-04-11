import React from "react";
import { useHistory, Link } from "react-router-dom";
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Heading,
  Text,
  VStack,
  ButtonGroup,
  Center,
  useToast,
} from "@chakra-ui/react";
import Header from "@components/Header";
import useDocTitle from "@hooks/useDocTitle";
import { useGameState } from "@contexts/GameStateContext/GameStateContext";
import type { IPlayer } from "@contexts/GameStateContext/types";
import get from "@utils/get";
import Game from "./Game";
import { usePlayers } from "@contexts/PlayersContext";

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
          pathname: "/",
          state: {
            invalidRoomCode: true,
          },
        });
      }
    }

    if (!newRoom) doesRoomExist();
  }, []);

  useDocTitle(roomCode);

  const { gameStarted, handleStartGame } = useGameState();
  const { players } = usePlayers();
  const prevPlayersRef = React.useRef<Array<IPlayer>>(players);

  React.useEffect(() => {
    const prevPlayers = prevPlayersRef.current;
    if (prevPlayers.length > players.length) {
      const playerLeft = prevPlayers.filter((x) => players.every((p) => p.id !== x.id))[0].name;
      toast({
        title: `${playerLeft} has disconnected.`,
        status: "info",
        duration: 5000,
        isClosable: false,
        position: "top-right",
        variant: "left-accent",
      });
    }
    prevPlayersRef.current = players;
  }, [players]);

  if (gameStarted) return <Game />;
  return (
    <>
      <Header>{roomCode}</Header>
      <Center marginTop="10">
        <VStack alignItems="center">
          <Heading as="h2">Players</Heading>
          <Divider />
          <VStack height="20rem" alignItems="center" overflowY="auto" width="100%">
            {players.map((player) => (
              <Text key={player.id}>{player.name}</Text>
            ))}
          </VStack>
          <FormControl display="flex" flexDirection="column">
            <ButtonGroup direction="row" spacing={4}>
              <Button to="/" as={Link} size="lg" variant="outline">
                Leave Lobby
              </Button>
              <Button disabled={players.length < 3 || players.length > 6} onClick={() => handleStartGame()} size="lg">
                Start Game
              </Button>
            </ButtonGroup>
            <Center>
              {players.length < 3 && <FormHelperText>Need at least 3 players to start the game.</FormHelperText>}
              {players.length > 6 && <FormHelperText>Can only support a maximum of 6 players.</FormHelperText>}
            </Center>
          </FormControl>
        </VStack>
      </Center>
    </>
  );
};

export default Lobby;
