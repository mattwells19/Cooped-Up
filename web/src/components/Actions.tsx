import { Button, Wrap, WrapItem, Text, VStack, ButtonProps, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import type { Action } from "../contexts/GameStateContext/types";
import { useGameState } from "../contexts/GameStateContext/GameStateContext";

interface WrappedButtonProps extends Omit<Omit<ButtonProps, "onClick">, "width"> {
  actionPayload?: { action: Action, victimId: string | null };
}

const Actions: React.FC = () => {
  const { handleGameEvent, currentPlayerId, turn } = useGameState();
  const isTurn = currentPlayerId.localeCompare(turn) === 0;

  const WrappedButton: React.FC<WrappedButtonProps> = ({ actionPayload, children, ...props }) => (
    <WrapItem>
      <Button
        disabled={!isTurn}
        onClick={() => handleGameEvent({
          event: "ACTION",
          eventPayload: actionPayload,
        })}
        width="130px"
        {...props}
      >
        {children}
      </Button>
    </WrapItem>
  );

  return (
    <VStack>
      <Text fontSize="lg" alignSelf="flex-start">
        {isTurn ? "It's your turn! Pick an action." : "It's not your turn."}
      </Text>
      <Wrap
        align="center"
        backgroundColor={useColorModeValue("gray.200", "gray.700")}
        justify="space-evenly"
        borderRadius="10px"
        height="280px"
        padding="3"
        width="324px"
        sx={{
          ul: {
            height: "100%",
          },
        }}
      >
        <WrappedButton colorScheme="purple">Collect Tax</WrappedButton>
        <WrappedButton colorScheme="blue">Steal</WrappedButton>
        <WrappedButton colorScheme="gray">Assassinate</WrappedButton>
        <WrappedButton colorScheme="green">Exchange</WrappedButton>
        <WrappedButton
          actionPayload={{
            action: "Income",
            victimId: null,
          }}
          variant="outline"
        >
          Income
        </WrappedButton>
        <WrappedButton variant="outline">Foreign Aid</WrappedButton>
        <WrappedButton colorScheme="red">Coup</WrappedButton>
      </Wrap>
    </VStack>
  );
};

export default Actions;
