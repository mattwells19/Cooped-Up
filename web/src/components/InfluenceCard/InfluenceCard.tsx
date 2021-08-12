import * as React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import type { Influence } from "@contexts/GameStateContext/types";
import { InfluenceDetails } from "@utils/InfluenceUtils";
import { BlankImg } from "@icons";
import DeadInfluenceOverlay from "./DeadInfluenceOverlay";

export interface IInfluenceCardProps {
  containerProps?: Partial<BoxProps>;
  imageProps?: Partial<React.SVGProps<SVGSVGElement>>;
  disableAnimation?: boolean;
  faceUp: boolean;
  influence: Influence;
  isDead?: boolean;
  onClick?: () => void;
}

const InfluenceCard: React.FC<IInfluenceCardProps> = ({
  containerProps,
  imageProps,
  influence,
  faceUp,
  onClick,
  disableAnimation = false,
  isDead = false,
}) => {
  const DisplayCard = faceUp || isDead ? InfluenceDetails[influence].img : BlankImg;
  
  const getCardLabel = () => {
    if (faceUp) {
      return influence;
    } else if (isDead) {
      return `Dead ${influence}`;
    } else {
      return "Hidden Influence";
    }
  };

  return (
    <Box position="relative" {...containerProps}>
      <DisplayCard
        onClick={onClick}
        aria-labelledby={getCardLabel()}
        {...imageProps}
      />
      {isDead && (
        <DeadInfluenceOverlay
          disableAnimation={disableAnimation}
          inset={containerProps?.padding as string | number | undefined}
        />
      )}
    </Box>
  );
};

export default InfluenceCard;
