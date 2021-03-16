import * as React from "react";
import { useHistory } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  Button,
  Center,
  Collapse,
  Divider,
  HStack,
  PinInput,
  PinInputField,
  Text,
  VStack,
  useToast,
  Input
} from "@chakra-ui/react";
import Header from "../components/Header";
import useDocTitle from "../hooks/useDocTitle";
import get from "../utils/get";

interface ILobbyProps {
  invalidRoomCode: boolean | undefined;
}

const Home: React.FC<ILobbyProps> = ({ invalidRoomCode }) => {
  const history = useHistory();
  const toast = useToast();
  useDocTitle("Home");
  const [error, setError] = React.useState<boolean>(false);
  const [playerName, setPlayerName] = React.useState<string>(localStorage.getItem("playerName") ?? "");

  async function handleJoinRoom(roomCode: string) {
    if (playerName) {
      console.log(playerName);
      localStorage.setItem("playerName", playerName);
      const validRoom = await get<boolean>(`checkRoom?roomCode=${roomCode}`);

      if (validRoom) history.push(`/room/${roomCode.toUpperCase()}`);
      else setError(true);
    }
  }

  function handleRoomCodeChange(code: string) {
    if (error && code.length !== 4) setError(false);
    else if (code.length === 4) handleJoinRoom(code);
  }

  async function handleNewRoom() {
    if (playerName) {
      console.log(playerName);
      localStorage.setItem("playerName", playerName);
      const roomCode = await get<string>("newRoom");

      history.push({
        pathname: `/room/${roomCode}`,
        state: {
          newRoom: true,
        },
      });
    }
  }

  React.useEffect(() => {
    if (invalidRoomCode) {
      toast({
        title: "The room you tried to join doesn't exist.",
        description: "Double check you have the correct room code, or start a new room.",
        status: "error",
        duration: 7000,
        isClosable: true,
        position: "top-right",
      });
      history.push({
        state: {
          invalidRoomCode: undefined,
        },
      });
    }
  }, []);

  return (
    <>
      <Header>Cooped Up</Header>
      <Center marginY="10" marginX="auto" maxWidth="lg">
        <VStack spacing={10}>
          
          {
            // if player's name is set, use Input with player's name as value; if not, use input with name as placeholder
            playerName ? <Input value={playerName} onChange={(e) => setPlayerName(e.target.value)} textAlign="center" ></Input> : <Input placeholder="name" onChange={(e) => setPlayerName(e.target.value)} textAlign="center"></Input>
          }
          <Text paddingX="4" fontSize="large">
            So you&apos;re all cooped up at home with nothing to do. You want to hang out with friends,
            but you can&apos;t because the virus is still at large. What better way to connect with your friends
            than with a little bit of deception!&nbsp;
            <Text fontWeight="bold" as="span">Cooped Up</Text>
            &nbsp;is based on the popular board game Coup.
          </Text>
          <Divider />
          <VStack spacing={4}>
            <Text>Already have a room code? Type/paste it here.</Text>
            <HStack>
              <PinInput
                autoFocus
                onChange={handleRoomCodeChange}
                isInvalid={error}
                size="lg"
                type="alphanumeric"
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
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
      </Center>
    </>
  );
};

export default Home;
