import * as React from "react";
import { Center, Image, Modal, ModalContent, ModalOverlay, Text, VStack } from "@chakra-ui/react";
import type { IPlayer } from "../contexts/GameStateContext/types";
import WaitingGif from "../images/Waiting.gif";

interface IWaitingForActionModal {
  action: string;
  performer: IPlayer;
  playerWaitingOn: IPlayer;
}

const WaitingForActionModal: React.FC<IWaitingForActionModal> = ({ action, performer, playerWaitingOn }) => (
  <Modal onClose={() => null} isOpen isCentered closeOnOverlayClick={false} size="xl">
    <ModalOverlay />
    <ModalContent>
      <VStack margin="10" spacing="6">
        <Text fontSize="large" textAlign="center">
          {`${performer.name} has chosen to ${action} ${playerWaitingOn.name}.`}
        </Text>
        <Text fontSize="large" textAlign="center">
          {`Waiting for ${playerWaitingOn.name} to choose an Influence to lose.`}
        </Text>
        <Center>
          <Image src={WaitingGif} />
        </Center>
      </VStack>
    </ModalContent>
  </Modal>
);

export default WaitingForActionModal;
