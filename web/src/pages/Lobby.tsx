import React from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import {
  Button, Center, Divider, Heading, Text, VStack, HStack,
} from "@chakra-ui/react";
import Header from "../components/Header";
import useDocTitle from "../hooks/useDocTitle";
import useGameState from "../hooks/useGameState";

const Lobby: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  useDocTitle(`Lobby - ${roomCode}`);
  const socket = React.useMemo(() => (
    io("/", {
      auth: { roomCode },
      autoConnect: false,
      reconnectionAttempts: 5,
    })
  ), [roomCode]);

  const {
    players, gameStarted, setPlayers, handleStartGame, handleGameStateUpdate,
  } = useGameState(socket);

  // put socket listeners in useEffect so it only registers on render
  React.useEffect(() => {
    socket.connect();

    socket.on("players_changed", (playersInRoom: string[]) => {
      if (!gameStarted) {
        setPlayers(playersInRoom.map((player) => ({
          coins: 2,
          influences: [],
          name: player,
        })));
      }
    });

    socket.on("gameStateUpdate", handleGameStateUpdate);

    // perform cleanup of socket when component is removed from the DOM
    return () => { socket.off(); };
  }, []);

  return (
    <>
      {!gameStarted
      && (
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
            <Button onClick={() => handleStartGame()} alignSelf="center">Start Game</Button>
          </VStack>
        </Center>
      </>
      )}
      {gameStarted
      && (
        <>
          <VStack>
            {players.map((player) => (
              <HStack key={player.name}>
                <Text>{player.name}</Text>
                <Text>{player.coins}</Text>
                <Text>{player.influences[0].type}</Text>
                <Text>{player.influences[1].type}</Text>
              </HStack>
            ))}
          </VStack>
        </>
      )}
    </>
  );
};

export default Lobby;
