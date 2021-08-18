import * as React from "react";
import { useHistory } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  Button,
  Collapse,
  Divider,
  HStack,
  PinInput,
  PinInputField,
  Text,
  VStack,
  useToast,
  Box,
} from "@chakra-ui/react";
import Header from "@components/Header";
import useDocTitle from "@hooks/useDocTitle";
import get from "@utils/get";
import CrownIcon from "@icons/CrownIcon";
import { useRoutingContext } from "@contexts/RoutingContext";

const Home = (): React.ReactElement => {
  const { newRoom, invalidRoomCode, setIsInvalidRoom, setIsNewRoom } = useRoutingContext();
  const history = useHistory();
  const toast = useToast();
  useDocTitle();
  const [error, setError] = React.useState<boolean>(false);

  async function handleJoinRoom(roomCode: string) {
    const validRoom = await get<boolean>(`checkRoom?roomCode=${roomCode}`);

    if (validRoom) history.push(`/room/${roomCode.toUpperCase()}`);
    else setError(true);
  }

  function handleRoomCodeChange(code: string) {
    if (error && code.length !== 4) setError(false);
    else if (code.length === 4) handleJoinRoom(code);
  }

  async function handleNewRoom() {
    const roomCode = await get<string>("newRoom");

    setIsNewRoom(true);
    history.push(`/room/${roomCode}`);
  }

  React.useEffect(() => {
    if (invalidRoomCode) {
      toast({
        description: "Double check you have the correct room code, or start a new room.",
        duration: 7000,
        isClosable: true,
        position: "top-right",
        status: "error",
        title: "The room you tried to join doesn't exist.",
      });
      setIsInvalidRoom(false);
    }
    if (newRoom) {
      setIsNewRoom(false);
    }
  }, []);

  return (
    <>
      <Header
        headingProps={{
          margin: "auto",
          position: "relative",
          transform: "translateY(10%)", // shift down so that it looks more center due to the crown
          width: "fit-content",
        }}
      >
        Cooped Up
        <Box position="absolute" top="0" left="0" transform="translate(-45%, -40%)">
          {/* scale flips the crown horizontally */}
          <CrownIcon width="2rem" transform="scale(-1, 1)" />
        </Box>
      </Header>
      <Box as="main" marginY="10" marginX="auto" maxWidth="lg">
        <VStack spacing={10}>
          <Text paddingX="4" fontSize="large">
            A web based version of the popular board game Coup.
          </Text>
          <Text paddingX="4" fontSize="large">
            {"So you're all cooped up at home with nothing to do. You want to hang out with friends, but you\
            can't because the virus is still at large. What better way to connect with your friends than with a\
            little bit of deception! "}
          </Text>
          <Text>🚧 Still in development. 🚧</Text>
          <Divider />
          <VStack spacing={4}>
            <Text>Already have a room code? Type/paste it here.</Text>
            <HStack>
              <PinInput autoFocus onChange={handleRoomCodeChange} isInvalid={error} size="lg" type="alphanumeric">
                <PinInputField aria-label="Room code, first letter." />
                <PinInputField aria-label="Room code, second letter." />
                <PinInputField aria-label="Room code, third letter." />
                <PinInputField aria-label="Room code, last letter." />
              </PinInput>
            </HStack>
            <Collapse in={error} animateOpacity>
              <Alert status="warning" width="sm">
                <AlertIcon />
                There is no room with that room code. Try a different code or start a new room.
              </Alert>
            </Collapse>
          </VStack>
          <HStack width="100%">
            <Divider />
            <Text>or</Text>
            <Divider />
          </HStack>
          <Button onClick={handleNewRoom} size="lg">
            Start a New Room
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default Home;
