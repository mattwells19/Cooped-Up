import * as React from "react";
import { Box, BoxProps, Image, ImageProps } from "@chakra-ui/react";
import type { Influence } from "@contexts/GameStateContext/types";
import { InfluenceDetails } from "@utils/InfluenceUtils";
import { BlankImg } from "@images/InfluenceImages";
import DeadInfluenceOverlay from "./DeadInfluenceOverlay";

export interface IInfluenceCardProps {
  containerProps?: Partial<BoxProps>;
  imageProps?: Partial<ImageProps>;
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
  return (
    <Box position="relative" {...containerProps}>
      <Image
        alt={faceUp || isDead ? `Dead ${influence}` : "Hidden Influence"}
        src={faceUp || isDead ? InfluenceDetails[influence].img : BlankImg}
        onClick={onClick}
        sx={{
          aspectRatio: 157 / 200
        }}
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
