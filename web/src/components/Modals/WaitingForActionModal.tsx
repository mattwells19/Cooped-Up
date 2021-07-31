import * as React from "react";
import { Center, Image, VStack } from "@chakra-ui/react";
import WaitingGif from "@images/Waiting.gif";
import BaseModal from "./BaseModal";

const WaitingForActionModal: React.FC = ({ children }) => (
  <BaseModal>
    <VStack margin="10" spacing="6" textAlign="center" fontSize="large">
      {children}
      <Center>
        <Image src={WaitingGif} />
      </Center>
    </VStack>
  </BaseModal>
);

export default WaitingForActionModal;
