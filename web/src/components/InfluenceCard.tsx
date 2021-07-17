import * as React from "react";
import { Box, BoxProps, Image, ImageProps, keyframes, useToken } from "@chakra-ui/react";
import type { Influence } from "@contexts/GameStateContext/types";
import { InfluenceDetails } from "@utils/InfluenceUtils";
import { BlankImg } from "@images/InfluenceImages";
import { DeathIcon } from "@icons";

export interface IInfluenceCardProps extends ImageProps {
  containerProps?: Partial<BoxProps>;
  disableAnimation?: boolean;
  faceUp: boolean;
  enlarge?: boolean;
  influence: Influence;
  isDead?: boolean;
  onClick?: () => void;
}

const fadeIn = keyframes({
  "0%": {
    backgroundColor: "transparent",
  },
  "100%": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  }
});

const growIn = keyframes({
  "0%": {
    opacity: 0,
    transform: "scale(0.9)",
  },
  "100%": {
    opacity: 1,
    transform: "scale(1)",
  }
});

const InfluenceCard: React.FC<IInfluenceCardProps> = ({
  containerProps,
  influence,
  faceUp,
  onClick,
  disableAnimation = false,
  enlarge = false,
  isDead = false,
  ...props 
}) => {
  const [iconWidthSm, iconWidthEnlarge] = useToken("sizes", ["24", "28"]);

  return (
    <Box position="relative" {...containerProps}>
      <Image
        alt={faceUp || isDead ? `Dead ${influence}` : "Hidden Influence"}
        src={faceUp || isDead ? InfluenceDetails[influence].img : BlankImg}
        htmlWidth={enlarge ? "200px" : "157px"}
        htmlHeight={enlarge ? "280px" : "220px"}
        onClick={onClick}
        {...props}
      />
      {isDead && (
        <Box
          position="absolute"
          inset={containerProps?.padding ?? 0}
          animation={disableAnimation ? "" : `${fadeIn} 1s ease-in`}
          backgroundColor="rgba(0, 0, 0, 0.5)"
          borderRadius="3px"
        >
          <Box
            animation={disableAnimation ? "" : `${growIn} 2.5s ease-in`}
            opacity={1}
            transform="scale(1)"
            marginX="auto"
            marginTop="2"
            width="min"
          >
            <DeathIcon
              color="rgba(255, 255, 255, 0.6)"
              width={enlarge ? iconWidthEnlarge : iconWidthSm}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InfluenceCard;
