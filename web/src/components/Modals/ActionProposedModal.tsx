import * as React from "react";
import { Button, ButtonGroup, Text, VStack } from "@chakra-ui/react";
import type { IPlayer } from "@contexts/GameStateContext/types";
import BaseModal from "./BaseModal";

interface IActionProposedModal {
  handleClose: (response: "PASS" | "CHALLENGE") => void;
  performer: IPlayer;
  action: string;
}

const ActionProposedModal: React.FC<IActionProposedModal> = ({ action, performer, handleClose }) => (
  <BaseModal>
    <VStack spacing="4" margin="10">
      <Text fontSize="large" textAlign="center">
        {`${performer.name} is trying to ${action}.`}
      </Text>
      <Text fontSize="large" textAlign="center">
        This is an action that can only be performed by:
      </Text>
      <Text fontSize="large" textAlign="center">
        Duke
      </Text>
      <ButtonGroup paddingTop="4">
        <Button onClick={() => handleClose("CHALLENGE")} width="36">Challenge</Button>
        <Button onClick={() => handleClose("PASS")} variant="outline" width="36">Pass</Button>
      </ButtonGroup>
    </VStack>
  </BaseModal>
);

export default ActionProposedModal;
