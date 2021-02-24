import { Button, Wrap, WrapItem, Text, VStack, ButtonProps, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { useGameState } from "../contexts/GameStateContext/GameStateContext";

const WrappedButton: React.FC<Omit<ButtonProps, "width">> = ({ children, ...props }) => (
  <WrapItem>
    <Button width="130px" {...props}>{children}</Button>
  </WrapItem>
);

const Actions: React.FC = () => {
  const gameState = useGameState();
  return (
    <VStack>
      <Text fontSize="lg" alignSelf="flex-start">Actions</Text>
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
        <WrappedButton variant="outline">Foreign Aid</WrappedButton>
        <WrappedButton colorScheme="yellow">Inquisite</WrappedButton>
        <WrappedButton variant="outline">Income</WrappedButton>
        <WrappedButton colorScheme="green">Exchange</WrappedButton>
        <WrappedButton colorScheme="red">Coup</WrappedButton>
      </Wrap>
    </VStack>
  );
};

export default Actions;
