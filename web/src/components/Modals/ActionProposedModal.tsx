import * as React from "react";
import { Button, ButtonGroup, Text, VStack, Image, Box } from "@chakra-ui/react";
import type { Actions, IPlayer } from "@contexts/GameStateContext/types";
import { getInfluencesFromAction, InfluenceDetails } from "@utils/InfluenceUtils";
import BaseModal from "./BaseModal";
import { ActionDetails } from "@utils/ActionUtils";

interface IActionProposedModal {
  handleClose: (response: "PASS" | "CHALLENGE" | "BLOCK") => void;
  performer: IPlayer;
  action: Actions;
  blocker?: IPlayer;
}

const ActionProposedModal: React.FC<IActionProposedModal> = ({ action, blocker, performer, handleClose }) => {
  const influences = getInfluencesFromAction(action);
  const { blockable, challengable } = ActionDetails[action];
  return (
    <>
      <Box position="absolute" left="50%" top="25%" transform="translateX(-50%) rotate(10deg)" zIndex="1401">
        {influences.map((influence) => (
          <Image key={influence} src={InfluenceDetails[influence].img} htmlWidth="200px" htmlHeight="280px" />
        ))}
      </Box>
      <BaseModal>
        <VStack spacing="4" margin="10">
          {!blocker && (
            <Text fontSize="large" textAlign="center">
              <Text as="span" fontSize="large" fontWeight="bold">
                {performer.name}
              </Text>
              {` is trying to ${action}.`}
            </Text>
          )}
          {blocker && (
            <Text fontSize="large" textAlign="center">
              <Text as="span" fontSize="large" fontWeight="bold">
                {blocker.name}
              </Text>
              {" is trying to block "}
              <Text as="span" fontSize="large" fontWeight="bold">
                {performer.name}
              </Text>
              {` from performing ${action}.`}
            </Text>
          )}
          {influences.length > 0  && (
            <Text fontSize="large" textAlign="center">
              This is an action that can only be performed by:
            </Text>
          )}
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
          {blockable && (
            <>
              <Text fontSize="large" textAlign="center">
                Only these influences can block this action:
              </Text>
              {blockable.map((influence) => (
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
            </>
          )}
          <ButtonGroup paddingTop="4">
            {(challengable || blocker) && (
              <Button onClick={() => handleClose("CHALLENGE")} width="36">
                Challenge
              </Button>
            )}
            {(blockable && !blocker) && (
              <Button
                onClick={() => handleClose("BLOCK")}
                width="36"
                colorScheme={InfluenceDetails[blockable[0]].colorScheme}
                bgGradient={`linear(to-r, ${blockable.map((inf) => InfluenceDetails[inf].color).join(", ")})`}
              >
                Block
              </Button>
            )}
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
