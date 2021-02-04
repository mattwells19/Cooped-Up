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
      <Header>Cooped Up</Header>
      <Center margin="auto" marginTop="10" maxWidth="lg">
        <VStack spacing={10}>
          <Text paddingX="4" fontSize="large">
            So you&apos;re all cooped up at home with nothing to do. You want to hang out with friends,
            but you can&apos;t because the virus is still at large. What better way to connect with your friends
            than with a little bit of deception!&nbsp;
            <Text fontWeight="bold" as="span">Cooped Up</Text>
            &nbsp;is based on the popular card game Coup.
          </Text>
          <Divider />
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
          <Button onClick={handleNewRoom}>
            Start a New Room
          </Button>
        </VStack>
      </Center>
    </>
  );
};

export default Home;
