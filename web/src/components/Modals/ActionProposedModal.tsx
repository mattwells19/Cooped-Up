import * as React from "react";
import { Button, ButtonGroup, Text, VStack, Image, Box } from "@chakra-ui/react";
import type { Actions, IPlayer } from "@contexts/GameStateContext/types";
import { getInfluencesFromAction, InfluenceDetails } from "@utils/InfluenceUtils";
import BaseModal from "./BaseModal";

interface IActionProposedModal {
  handleClose: (response: "PASS" | "CHALLENGE") => void;
  performer: IPlayer;
  action: Actions;
}

const ActionProposedModal: React.FC<IActionProposedModal> = ({ action, performer, handleClose }) => {
  const influences = getInfluencesFromAction(action);
  return (
    <>
      <Box position="absolute" left="50%" top="25%" transform="translateX(-50%) rotate(10deg)" zIndex="1401">
        {influences.map((influence) => (
          <Image key={influence} src={InfluenceDetails[influence].img} htmlWidth="200px" htmlHeight="280px" />
        ))}
      </Box>
      <BaseModal>
        <VStack spacing="4" margin="10">
          <Text fontSize="large" textAlign="center">
            <Text as="span" fontSize="large" fontWeight="bold">
              {performer.name}
            </Text>
            {` is trying to ${action}.`}
          </Text>
          <Text fontSize="large" textAlign="center">
            This is an action that can only be performed by:
          </Text>
          {influences.map((influence) => (
            <Text
              key={influence}
              fontSize="large"
              textAlign="center"
              fontWeight="bold"
              color={InfluenceDetails[influence].color}
            >
              {influence}
            </Text>
          ))}
          <ButtonGroup paddingTop="4">
            <Button onClick={() => handleClose("CHALLENGE")} width="36">
              Challenge
            </Button>
            <Button onClick={() => handleClose("PASS")} variant="outline" width="36">
              Pass
            </Button>
          </ButtonGroup>
        </VStack>
      </BaseModal>
    </>
  );
};

export default ActionProposedModal;
