import * as React from "react";
import {
  AspectRatio,
  Box,
  BoxProps,
  Image,
  ImageProps,
  keyframes,
  useBreakpointValue,
  useToken
} from "@chakra-ui/react";
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
  const iconWidthSmBkpt = useBreakpointValue(["12", "24"]);
  const iconWidthEnlargeBkpt = useBreakpointValue(["12", "28"]);
  const [iconWidthSm, iconWidthEnlarge] = useToken("sizes", [iconWidthSmBkpt ?? "24", iconWidthEnlargeBkpt ?? "28"]);

  return (
    <Box position="relative" {...containerProps}>
      <AspectRatio width={enlarge ? ["80px", "200px"] : ["78px", "157px"]} ratio={157 / 220}>
        <Image
          alt={faceUp || isDead ? `Dead ${influence}` : "Hidden Influence"}
          src={faceUp || isDead ? InfluenceDetails[influence].img : BlankImg}
          onClick={onClick}
          {...props}
        />
      </AspectRatio>
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
