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
    <VStack spacing={["2px", "4px"]} width={isCurrentPlayer ? ["165px", "420px"] : ["160px", "325px"]}>
      <HStack justifyContent="space-between" width="100%" fontSize={["md", "large"]}>
        <Text {...playerNameProps}>{player.name}</Text>
        <Text color="gray.400">{`Coins: ${player.coins}`}</Text>
      </HStack>
      <HStack spacing={isCurrentPlayer ? ["4px", "20px"] : ["4px", "10px"]}>
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
