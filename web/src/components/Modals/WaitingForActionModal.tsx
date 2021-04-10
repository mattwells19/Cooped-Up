import * as React from "react";
import { Center, Image, Text, VStack, useId } from "@chakra-ui/react";
import WaitingGif from "@images/Waiting.gif";
import BaseModal from "./BaseModal";

interface IWaitingForActionModal {
  messaging: Array<React.ReactElement | string>;
}

const WaitingForActionModal: React.FC<IWaitingForActionModal> = ({ messaging }) => (
  <BaseModal>
    <VStack margin="10" spacing="6">
      {messaging.map((m) => (
        <Text key={useId()} fontSize="large" textAlign="center">
          {m}
        </Text>
      ))}
      <Center>
        <Image src={WaitingGif} />
      </Center>
    </VStack>
  </BaseModal>
);

export default WaitingForActionModal;
