import { Text, useId, keyframes, TextProps, Flex, FlexProps, } from "@chakra-ui/react";
import * as React from "react";
import type { IPlayer } from "@contexts/GameStateContext/types";
import InfluenceCard from "./InfluenceCard/InfluenceCard";

interface IPlayerHandProps extends FlexProps {
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

const PlayerHand: React.FC<IPlayerHandProps> = ({ isCurrentPlayer, isTurn, player, ...props }) => {
  const playerNameProps: TextProps = isTurn ? {
    animation: `${nowYourTurnAnimation} 1s`,
    color: "pink.300",
    fontWeight: "bold",
  } : {};

  return (
    <Flex flexDirection="column" gridGap="1" {...props}>
      <Flex justifyContent="space-between" width="full" fontSize={["md", "large"]}>
        <Text {...playerNameProps}>{player.name}</Text>
        <Text color="gray.400">{`Coins: ${player.coins}`}</Text>
      </Flex>
      <Flex gridGap="6px" width="full">
        {player.influences.map(({ type, isDead }) => (
          <InfluenceCard
            key={`${player.name}-${type}-${useId()}`}
            influence={type}
            faceUp={Boolean(isCurrentPlayer)}
            isDead={isDead}
            enlarge={isCurrentPlayer}
            containerProps={{
              width: "100%",
            }}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default PlayerHand;
