import * as React from "react";
import { Box, Center, Text, VStack } from "@chakra-ui/react";
import type { IPlayer } from "@contexts/GameStateContext/types";
import { ChallengeIcon } from "@icons";
import BaseModal from "./BaseModal";

interface IChallengedModal {
  performer: IPlayer;
  challenger: IPlayer;
  onDone: () => void;
}

const CustomBox: React.FC = ({ children }) => (
  <Box
    alignItems="center"
    backgroundColor="gray.700"
    filter="drop-shadow(0px 4px 1px #242830)"
    display="flex"
    justifyContent="center"
    width="100%"
    height="16"
    borderRadius="2xl"
  >
    {children}
  </Box>
);

const ChallengedModal: React.FC<IChallengedModal> = ({ performer, challenger, onDone }) => (
  <BaseModal>
    <Center backgroundColor="#4D2527" flexDirection="column" padding="2" rounded="md">
      <ChallengeIcon width="93px" height="93px" />
      <Text textTransform="uppercase" fontFamily="Nova Flat" fontSize="5xl" color="#E4E768" textAlign="center">
        Challenge
      </Text>
      <VStack width="100%" spacing="2">
        <CustomBox>
          <Text fontSize="larger">
            <Text as="span" fontWeight="bold">{challenger.name}</Text>
            &nbsp;has challenged that&nbsp;
            <Text as="span" fontWeight="bold">{performer.name}</Text>
            &nbsp;has a Duke!
          </Text>
        </CustomBox>
        <CustomBox>
          <Text fontSize="larger">
            <Text as="span" fontWeight="bold">{challenger.name}</Text>
            &nbsp;has&nbsp;
            <Text as="span" color="red.300" textTransform="uppercase" fontWeight="bold">
              Lost
            </Text>
            &nbsp;the challenge.
          </Text>
        </CustomBox>
        <CustomBox>
          <Text fontSize="larger">
            Waiting for&nbsp;
            <Text as="span" fontWeight="bold">{challenger.name}</Text>
            &nbsp;to choose an influence to lose...
          </Text>
        </CustomBox>
      </VStack>
    </Center>
  </BaseModal>
);

export default ChallengedModal;
