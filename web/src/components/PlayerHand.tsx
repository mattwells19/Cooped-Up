import { VStack, HStack, Text, useId } from "@chakra-ui/react";
import * as React from "react";
import type { IPlayer } from "@contexts/GameStateContext/types";
import InfluenceCard from "./InfluenceCard";

interface IPlayerHandProps {
  isCurrentPlayer?: boolean;
  player: IPlayer;
}

const PlayerHand: React.FC<IPlayerHandProps> = ({ isCurrentPlayer, player }) => (
  <VStack width={isCurrentPlayer ? "420px" : "325px"}>
    <HStack justifyContent="space-between" width="100%">
      <Text fontSize="lg">{player.name}</Text>
      <Text fontSize="lg" color="gray.400">{`Coins: ${player.coins}`}</Text>
    </HStack>
    <HStack spacing={isCurrentPlayer ? "20px" : "10px"}>
      {player.influences.map(({ type, isDead }) => (
        <InfluenceCard
          key={`${player.name}-${type}-${useId()}`}
          influence={type}
          faceUp={isCurrentPlayer || isDead}
          enlarge={isCurrentPlayer}
        />
      ))}
    </HStack>
  </VStack>
);

export default PlayerHand;
