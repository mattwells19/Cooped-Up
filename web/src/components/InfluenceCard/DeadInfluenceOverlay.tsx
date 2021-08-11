import { Box, keyframes } from "@chakra-ui/react";
import { DeathIcon } from "@icons";
import * as React from "react";

interface IDeadInfluenceOverlayProps {
  disableAnimation: boolean;
  inset?: string | number;
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

const DeadInfluenceOverlay: React.FC<IDeadInfluenceOverlayProps> = ({ disableAnimation, inset }) => {
  // TODO - check me
  return (
    <Box
      position="absolute"
      inset={inset ?? 0}
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
          width="25%"
        />
      </Box>
    </Box>
  );
};

export default DeadInfluenceOverlay;