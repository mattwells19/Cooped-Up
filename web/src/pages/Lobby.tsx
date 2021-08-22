import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Heading,
  Link as Anchor,
  ButtonGroup,
  Center,
  useToast,
  ListItem,
  Text,
  IconButton,
  Tooltip,
  List,
  Box,
} from "@chakra-ui/react";
import Header from "@components/Header";
import useDocTitle from "@hooks/useDocTitle";
import { useGameState } from "@contexts/GameStateContext/GameStateContext";
import type { IPlayer } from "@contexts/GameStateContext/types";
import { usePlayers } from "@contexts/PlayersContext";
import EditIcon from "@icons/EditIcon";
import { useRoutingContext } from "@contexts/RoutingContext";

const Lobby = (): React.ReactElement => {
  const toast = useToast();
  const { roomCode } = useRoutingContext();

  // shouldn't happen since we redirect if there's no roomCode
  useDocTitle(roomCode ?? "");

  const { handleStartGame, currentPlayer } = useGameState();
  const { players } = usePlayers();
  const prevPlayersRef = React.useRef<Array<IPlayer>>(players);

  React.useEffect(() => {
    const prevPlayers = prevPlayersRef.current;
    if (prevPlayers.length > players.length) {
      const playerLeft = prevPlayers.filter((x) => players.every((p) => p.id !== x.id))[0].name;
      toast({
        duration: 5000,
        isClosable: false,
        position: "top-right",
        status: "info",
        title: `${playerLeft} has disconnected.`,
        variant: "left-accent",
      });
    }
    prevPlayersRef.current = players;
  }, [players]);

  return (
    <>
      <Header>{roomCode}</Header>
      <Box marginY="10" width="xs" marginX="auto" display="flex" flexDirection="column" gridGap="3">
        <Heading as="h2">Players</Heading>
        <Divider />
        <List
          height="20rem"
          overflowY="auto"
          width="100%"
          paddingLeft="3"
        >
          {players.map((player) => (
            <ListItem
              key={player.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              height="40px"
            >
              {player.id === currentPlayer.id ? (
                <>
                  <Text fontWeight="bold">{player.name}</Text>
                  <Tooltip label="Edit name.">
                    <IconButton
                      aria-label="Edit name."
                      as={Link}
                      to={`/name?roomCode=${roomCode}`}
                      colorScheme="gray"
                      inset="0"
                      left="auto"
                      variant="ghost"
                      borderRadius="md"
                      minWidth="auto"
                      width="30px"
                      height="30px"
                      icon={<EditIcon width="20px" />}
                    />
                  </Tooltip>
                </>
              ) : (
                <Text>{player.name}</Text>
              )}
            </ListItem>
          ))}
        </List>
        <FormControl display="flex" flexDirection="column">
          <ButtonGroup direction="row" spacing={4}>
            <Button to="/" as={Link} size="lg" variant="outline">
              Leave Lobby
            </Button>
            <Button disabled={players.length < 3 || players.length > 6} onClick={() => handleStartGame()} size="lg">
              Start Game
            </Button>
          </ButtonGroup>
          <Center>
            {players.length < 3 && <FormHelperText>Need at least 3 players to start the game.</FormHelperText>}
            {players.length > 6 && <FormHelperText>Can only support a maximum of 6 players.</FormHelperText>}
          </Center>
        </FormControl>
        <Box marginTop="10" display="flex" flexDirection="column" gridGap="5">
          <Text>
            {"Welcome to Cooped Up! This online version plays very similarly to the original game Coup, so if you \
              need a refresher on the rules check out this awesome explanation from Geek and Sundry."}
          </Text>
          <Box
            as="iframe"
            width="100%"
            height="315px"
            src="https://www.youtube.com/embed/a8bY3zI9FL4"
            title="YouTube video player - How to play Coup"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <Text>
            <Text as="span">
              {"If you'd like a more detailed, typed out explanation of the rules you can check them out at "}
            </Text>
            <Anchor
              href="https://www.ultraboardgames.com/coup/game-rules.php"
              referrerPolicy="no-referrer"
              target="_blank"
              color="teal.200"
              textDecoration="underline"
            >
              Ultra Board Games
            </Anchor>.
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default Lobby;
