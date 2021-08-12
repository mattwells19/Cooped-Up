import * as React from "react";
import { Center, HStack, Text, useId, VStack } from "@chakra-ui/react";
import type { Influence, IPlayer } from "@contexts/GameStateContext/types";
import InfluenceCard from "../InfluenceCard/InfluenceCard";
import BaseModal from "./BaseModal";

interface ILoseInfluenceModal {
  handleClose: (killInfluence: Influence) => void;
  currentPlayer: IPlayer;
}

const LoseInfluenceModal: React.FC<ILoseInfluenceModal> = ({ currentPlayer, handleClose }) => {
  const [isHovered, setIsHovered] = React.useState<Array<boolean>>([false, false]);

  return (
    <BaseModal>
      <VStack spacing="4" margin="10">
        <Text fontSize="large" textAlign="center">
          Select an influence to lose.
        </Text>
        <Center>
          <HStack spacing="10px">
            {currentPlayer.influences
              .filter((i) => !i.isDead)
              .map((influence, index) => {
                return (
                  <InfluenceCard
                    key={`${influence.type}-${useId()}`}
                    faceUp
                    influence={influence.type}
                    onClick={() => handleClose(influence.type)}
                    imageProps={{
                      transform: isHovered[index] ? `scale(1.1) translateX(${index === 0 ? "-10px" : "10px"})` : "",
                      // transition: "transform 500ms",
                    }}
                    containerProps={{
                      onMouseOut: () => setIsHovered((prev) => {
                        const newHovered = [...prev];
                        newHovered[index] = false;
                        return newHovered;
                      }),
                      onMouseOver: () => setIsHovered((prev) => {
                        const newHovered = [...prev];
                        newHovered[index] = true;
                        return newHovered;
                      }),
                      role: "button",
                    }}
                  />
                );
              })}
          </HStack>
        </Center>
      </VStack>
    </BaseModal>
  );
};

export default LoseInfluenceModal;
