import * as React from "react";
import { Box, BoxProps, css } from "@chakra-ui/react";
import type { Influence } from "@contexts/GameStateContext/types";
import { InfluenceDetails } from "@utils/InfluenceUtils";
import { BackImg } from "@icons/influences";
import DeadInfluenceOverlay from "./DeadInfluenceOverlay";

export interface IInfluenceCardProps {
  button?: boolean;
  containerProps?: Partial<BoxProps>;
  imageProps?: Partial<React.SVGProps<SVGSVGElement>>;
  disableAnimation?: boolean;
  faceUp: boolean;
  influence: Influence;
  isDead?: boolean;
  onClick?: () => void;
}

const InfluenceCard: React.FC<IInfluenceCardProps> = ({
  button = false,
  containerProps,
  imageProps,
  influence,
  faceUp,
  onClick,
  disableAnimation = false,
  isDead = false,
}) => {
  const DisplayCard = faceUp || isDead ? InfluenceDetails[influence].img : BackImg;
  
  const getCardLabel = () => {
    if (faceUp) {
      return influence;
    } else if (isDead) {
      return `Dead ${influence}`;
    } else {
      return "Hidden Influence";
    }
  };

  const buttonClass = css({
    _hover: {
      transform: "scale(1.05)",
    },
    role: "button",
    transition: "transform 500ms",
  });

  return (
    <Box
      as={button ? "button" : undefined}
      css={button ? buttonClass : undefined}
      position="relative"
      width="full"
      {...containerProps}
    >
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
