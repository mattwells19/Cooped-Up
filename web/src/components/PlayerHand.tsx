import { VStack, HStack, Text, useId, keyframes, TextProps } from "@chakra-ui/react";
import * as React from "react";
import type { IPlayer } from "@contexts/GameStateContext/types";
import InfluenceCard from "./InfluenceCard";

interface IPlayerHandProps {
  isCurrentPlayer?: boolean;
  player: IPlayer;
  isTurn?: boolean;
}

const nowYourTurnAnimation = keyframes({
  "0%": {
    transform: "scale(1)",
  },
  "50%": {
    fontWeight: "bold",
    transform: "scale(1.2)",
  },
  // eslint-disable-next-line sort-keys
  "100%": {
    transform: "scale(1)",
  },
});

const PlayerHand: React.FC<IPlayerHandProps> = ({ isCurrentPlayer, isTurn, player }) => {
  const playerNameProps: TextProps = isTurn ? {
    animation: `${nowYourTurnAnimation} 1s`,
    color: "pink.300",
    fontWeight: "bold",
  } : {};

  return (
    <VStack width={isCurrentPlayer ? "420px" : "325px"}>
      <HStack justifyContent="space-between" width="100%">
        <Text {...playerNameProps} fontSize="lg">{player.name}</Text>
        <Text fontSize="lg" color="gray.400">{`Coins: ${player.coins}`}</Text>
      </HStack>
      <HStack spacing={isCurrentPlayer ? "20px" : "10px"}>
        {player.influences.map(({ type, isDead }) => (
          <InfluenceCard
            key={`${player.name}-${type}-${useId()}`}
            influence={type}
            faceUp={Boolean(isCurrentPlayer)}
            isDead={isDead}
            enlarge={isCurrentPlayer}
          />
        ))}
      </HStack>
    </VStack>
  );
};

export default PlayerHand;
