import * as React from "react";
import { useHistory } from "react-router-dom";
import {
  Button, Center, Divider, HStack, PinInput, PinInputField, Text, VStack,
} from "@chakra-ui/react";
import Header from "../components/Header";

const Home: React.FC = () => {
  const history = useHistory();

  function handleJoinRoom(roomCode: string) {
    // TODO validate room already exists before joining
    history.push(`/room/${roomCode.toUpperCase()}`);
  }

  function handleNewRoom() {
    // TODO: generate new room code
    const roomCode = "NEW";
    history.push(`/room/${roomCode}`);
  }

  return (
    <>
      <Header>Coup</Header>
      <Center marginTop="10">
        <VStack spacing={10}>
          <VStack spacing={4}>
            <Text>Already have a room code? Type it here.</Text>
            <HStack>
              <PinInput autoFocus onComplete={handleJoinRoom} type="alphanumeric">
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </VStack>
          <HStack width="100%">
            <Divider />
            <Text>or</Text>
            <Divider />
          </HStack>
          <Button colorScheme="teal" onClick={handleNewRoom} className="secondary">
            Start a New Room
          </Button>
        </VStack>
      </Center>
    </>
  );
};

export default Home;
