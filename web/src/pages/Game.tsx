import * as React from "react";
import type { Socket } from "socket.io-client";
import { Text, VStack, HStack } from "@chakra-ui/react";
import type { IPlayer } from "../hooks/useGameState";
import useGameState from "../hooks/useGameState";

interface IGameProps {}

const Game: React.FC<IGameProps> = () => {
  const { players } = useGameState();
  console.log(players.map(player => player.influences))

  return (
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
  )
};

export default Game;
