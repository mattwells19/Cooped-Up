import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import * as React from "react";
import { useHistory } from "react-router-dom";
import Header from "@components/Header";

interface IPlayerNameProps {
  newRoom: boolean | undefined;
  roomCode: string;
}

const PlayerName: React.FC<IPlayerNameProps> = ({ newRoom, roomCode }) => {
  const [playerName, setPlayerName] = React.useState<string>("");
  const [error, setError] = React.useState<boolean>(false);
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedPlayerName = playerName.trim();
    if (trimmedPlayerName.length === 0 || trimmedPlayerName.length > 15) setError(true);
    else {
      localStorage.setItem("playerName", trimmedPlayerName);
      history.replace({
        pathname: `/room/${roomCode}`,
        state: {
          newRoom,
        },
      });
    }
  };

  return (
    <>
      <Header>{roomCode}</Header>
      <Box as="form" marginX="auto" marginY="8" width={["sm", "md"]} onSubmit={handleSubmit}>
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
