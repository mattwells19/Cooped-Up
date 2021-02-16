import React from "react";
import { io } from "socket.io-client";
import { useParams, useHistory, useLocation } from "react-router-dom";
import {
  Button, Center, Divider, Heading, HStack, Input, Text, VStack,
} from "@chakra-ui/react";
import Header from "../components/Header";
import useDocTitle from "../hooks/useDocTitle";

const Lobby: React.FC = () => {

  //use history module to push URLs
  const history = useHistory();

  const { roomCode } = useParams<{ roomCode: string }>();

  function doesRoomExist() {    

    //Timeout function to give a chance to check api
setTimeout(async function(){
    //Check if a room exists 
    const validRoom = await fetch(`/api/checkRoom?roomCode=${roomCode}`, { method: "GET" })
      .then((data) => data.json())
      .catch((err) => { throw Error(err); });
  
      //If the room exists then take me to the room
      //If the room does not exist then take me back home
      //Can implement an error message whenever this is working properly
     if (!validRoom) history.push(`/`);}, 1);



    console.log('test');
  }
  
  useDocTitle(`Lobby - ${roomCode}`);
  const socket = React.useMemo(() => (
    io("/", {
      auth: { roomCode },
      autoConnect: false,
      reconnectionAttempts: 5,
    })
  ), [roomCode]);

  const [messages, setMessages] = React.useState<string[]>([]);
  const [draft, setDraft] = React.useState<string>("");

  // put socket listeners in useEffect so it only registers on render
  React.useEffect(() => {
    socket.connect();

    socket.on("new_message", (data: string) => {
      setMessages((prev) => [...prev, data]);
    });

    // perform cleanup of socket when component is removed from the DOM
    return () => { socket.off(); };
  }, []);

  function handleSend(e: React.FormEvent<HTMLDivElement>): void {
    e.preventDefault();
    socket.emit("message", draft.trim());
    setDraft("");
  }

    doesRoomExist();
  

  return (
    <>
      <Header>{roomCode}</Header>
      <Center marginTop="10">
        <VStack alignItems="flex-start">
          <Heading as="h2">Chat</Heading>
          <Divider />
          <VStack height="20rem" alignItems="flex-start" overflowY="auto" width="100%">
            {messages.map((message, i) => (
              // disabling only bc this is temporary
              // eslint-disable-next-line react/no-array-index-key
              <Text key={`${message}${i}`}>{message}</Text>
            ))}
          </VStack>
          <HStack as="form" onSubmit={handleSend}>
            <Input autoFocus onChange={(e) => setDraft(e.target.value)} value={draft} />
            <Button disabled={draft.trim().length === 0} type="submit">Send</Button>
          </HStack>
        </VStack>
      </Center>
    </>
  );
};

export default Lobby;
