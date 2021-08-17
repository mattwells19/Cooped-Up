import * as React from "react";
import { Button, ButtonGroup, Text, VStack, Tooltip, Divider, Box } from "@chakra-ui/react";
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
  hasPassed: boolean;
}

const ActionProposedModal: React.FC<IActionProposedModal> = ({
  action,
  blockDetails,
  currentPlayer,
  performer,
  victim,
  handleClose,
  hasPassed,
}) => {
  const influence = getInfluenceFromAction(action);
  const { blockable, challengable } = ActionDetails[action];
  const { blocker, blockingInfluence } = blockDetails;
  const showBlockBtns = Boolean((!blocker && (!victim || currentPlayer.id === victim.id)) && blockable);

  return (
    <BaseModal>
      <VStack spacing="4" margin={["5", "10"]}>
        {!blocker && (
          <Text fontSize="large" textAlign="center">
            <Text as="span" fontSize="large" fontWeight="bold">
              {performer.name}
            </Text>
            {` is trying to ${action}`}
            {victim && <Text as="span" fontSize="large" fontWeight="bold">
              {` ${victim.name}`}
            </Text>}
            .
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
        <Divider />
        {hasPassed ? (
          <>
            <Text fontSize="large" textAlign="center">
              You have chosen to pass.
            </Text>
            <Text fontSize="large" textAlign="center">
              Waiting for all players to pass/challenge...
            </Text>
          </>
        ) : (
          <Box
            paddingTop="4"
            width="100%"
            gridGap="2"
            display="grid"
            gridTemplateColumns={["1fr", `repeat(${(blockable?.length ?? 0) + 1}, 1fr)`]}
            gridTemplateRows="1fr"
          >
            {(challengable || blocker) && (
              <Button onClick={() => handleClose({ type: "CHALLENGE" })}>
                Challenge
              </Button>
            )}
            {showBlockBtns && blockable && (
              <ButtonGroup isAttached>
                {blockable.map((inf) => (
                  <Tooltip hasArrow label={`Block as ${inf}.`} key={inf}>
                    <Button
                      width="full"
                      onClick={() => handleClose({ influence: inf, type: "BLOCK" })}
                      colorScheme={InfluenceDetails[inf].colorScheme}
                      whiteSpace="normal"
                    >
                      Block as {inf}
                    </Button>
                  </Tooltip>
                ))}
              </ButtonGroup>
            )}
            <Button onClick={() => handleClose({ type: "PASS" })} variant="outline">
              Pass
            </Button>
          </Box>
        )}
      </VStack>
    </BaseModal>
  );
};

export default ActionProposedModal;
