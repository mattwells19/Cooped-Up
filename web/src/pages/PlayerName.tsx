import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import * as React from "react";
import { useHistory } from "react-router-dom";
import Header from "@components/Header";
import { useRoutingContext } from "@contexts/RoutingContext";

const PlayerName = (): React.ReactElement => {
  const [playerName, setPlayerName] = React.useState<string>(localStorage.getItem("playerName") ?? "");
  const [error, setError] = React.useState<boolean>(false);
  const history = useHistory();
  const { roomCode } = useRoutingContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedPlayerName = playerName.trim();
    if (trimmedPlayerName.length === 0 || trimmedPlayerName.length > 15) setError(true);
    else {
      localStorage.setItem("playerName", trimmedPlayerName);
      history.replace({
        pathname: roomCode ? `/room/${roomCode}` : "/",
      });
    }
  };

  return (
    <>
      <Header>{roomCode ?? "Player Name"}</Header>
      <Box as="form" marginX="auto" marginY="8" maxWidth="md" paddingX="3" onSubmit={handleSubmit}>
        <FormControl isRequired isInvalid={error} id="name">
          <FormLabel>Your Name</FormLabel>
          <Box display="flex" gridGap="3">
            <Input
              autoFocus
              value={playerName}
              maxLength={15}
              placeholder="Alex Citing"
              onChange={(e) => {
                if (error) setError(false);
                setPlayerName(e.target.value);
              }}
              textAlign="center"
            />
            <Button type="submit" width="24">
              Save
            </Button>
          </Box>
          <FormErrorMessage>
            Please enter a valid name.
            <br />
            Max characters: 15
          </FormErrorMessage>
        </FormControl>
      </Box>
    </>
  );
};

export default PlayerName;
