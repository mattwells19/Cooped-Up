import React from "react";
import { useParams } from "react-router-dom";
import {
  Button, Center, Divider, Heading, Text, VStack,
} from "@chakra-ui/react";
import Header from "../components/Header";
import useDocTitle from "../hooks/useDocTitle";
import useGameState from "../hooks/useGameState";
import Game from "./Game";

const Lobby: React.FC = () => {
  const { roomCode } = useParams<{ roomCode: string }>();
  useDocTitle(`Lobby - ${roomCode}`);

  const {
    players, gameStarted, handleStartGame,
  } = useGameState();

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
      {gameStarted && <Game />}
    </>
  );
};

export default Lobby;
