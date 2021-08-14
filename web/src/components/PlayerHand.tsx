import { useId, keyframes, TextProps, FlexProps, } from "@chakra-ui/react";
import * as React from "react";
import type { IPlayer } from "@contexts/GameStateContext/types";
import InfluenceCard from "@components/InfluenceCard";
import { CardSet, CardSetHeader, CardSetInfluences } from "./CardSet";

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
    <CardSet {...props}>
      <CardSetHeader
        primaryText={player.name}
        secondaryText={`Coins: ${player.coins}`}
        primaryTextProps={playerNameProps}
      />
      <CardSetInfluences>
        {player.influences.map(({ type, isDead }) => (
          <InfluenceCard
            key={`${player.name}-${type}-${useId()}`}
            influence={type}
            faceUp={Boolean(isCurrentPlayer)}
            isDead={isDead}
            containerProps={{
              width: "100%",
            }}
          />
        ))}
      </CardSetInfluences>
    </CardSet>
  );
};

export default PlayerHand;
