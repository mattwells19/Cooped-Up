import * as React from "react";
import { Button, ButtonGroup, Text, VStack, Image, Box, Tooltip } from "@chakra-ui/react";
import type { Actions, IActionResponse, Influence, IPlayer } from "@contexts/GameStateContext/types";
import { getInfluenceFromAction, InfluenceDetails } from "@utils/InfluenceUtils";
import BaseModal from "./BaseModal";
import { ActionDetails } from "@utils/ActionUtils";

interface IActionProposedModal {
  action: Actions;
  blockDetails: { blocker: IPlayer | undefined, blockingInfluence: Influence | undefined };
  currentPlayer: IPlayer;
  performer: IPlayer;
  victim?: IPlayer;
  handleClose: (response: IActionResponse) => void;
}

const ActionProposedModal: React.FC<IActionProposedModal> = ({
  action,
  blockDetails,
  currentPlayer,
  performer,
  victim,
  handleClose
}) => {
  const influence = getInfluenceFromAction(action);
  const { blockable, challengable } = ActionDetails[action];
  const { blocker, blockingInfluence } = blockDetails;

  return (
    <>
      {(blockingInfluence || influence) && (
        <Box position="absolute" left="50%" top="25%" transform="translateX(-50%) rotate(10deg)" zIndex="1401">
          <Image
            key={influence}
            // Wouldn't be here if both of these were null so non-null assertion should be safe
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            src={InfluenceDetails[blockingInfluence ?? influence!].img}
            htmlWidth="200px"
            htmlHeight="280px"
          />
        </Box>
      )}
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
          {blocker && blockingInfluence && (
            <Text fontSize="large" textAlign="center">
              <Text as="span" fontSize="large" fontWeight="bold">
                {blocker.name}
              </Text>
              {" is trying to block "}
              <Text as="span" fontSize="large" fontWeight="bold">
                {performer.name}
              </Text>
              {` from performing ${action} using a(n) `}
              <Text as="span" fontSize="large" fontWeight="bold" color={InfluenceDetails[blockingInfluence].color}>
                {blockingInfluence}
              </Text>
              .
            </Text>
          )}
          {!blocker && influence && (
            <>
              <Text fontSize="large" textAlign="center">
                This is an action that can only be performed by:
              </Text>
              <Text
                key={influence}
                fontSize="large"
                textAlign="center"
                fontWeight="bold"
                color={InfluenceDetails[influence].color}
              >
                {influence}
              </Text>
            </>
          )}
          {blockable && !blocker && (
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
              <Button onClick={() => handleClose({ type: "CHALLENGE" })} width="36">
                Challenge
              </Button>
            )}
            {(!blocker && (!victim || currentPlayer.id === victim.id)) && blockable && (
              <ButtonGroup isAttached width="36">
                {blockable.map((inf) => (
                  <Tooltip hasArrow label={`Block using ${inf}.`} key={inf}>
                    <Button
                      width="full"
                      onClick={() => handleClose({ type: "BLOCK", influence: inf })}
                      colorScheme={InfluenceDetails[inf].colorScheme}
                    >
                      Block
                    </Button>
                  </Tooltip>
                ))}
              </ButtonGroup>
            )}
            <Button onClick={() => handleClose({ type: "PASS" })} variant="outline" width="36">
              Pass
            </Button>
          </ButtonGroup>
        </VStack>
      </BaseModal>
    </>
  );
};

export default ActionProposedModal;
