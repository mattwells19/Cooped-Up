import * as React from "react";
import { Wrap, WrapItem, HStack, Box, useDisclosure, IconButton, Tooltip } from "@chakra-ui/react";
import { useGameState } from "@contexts/GameStateContext/GameStateContext";
import PlayerHand from "@components/PlayerHand";
import Actions from "@components/Actions/Actions";
import GameModalChooser from "@components/GameModalChooser";
import { usePlayers } from "@contexts/PlayersContext";
import GameHelpSidebar from "@components/GameHelpSidebar";
import { HelpIcon } from "@icons";

const Game: React.FC = () => {
  const { currentPlayer, currentPlayerTurn } = useGameState();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { players } = usePlayers();
  const otherPlayers = players.filter((player) => player.id.localeCompare(currentPlayer.id) !== 0);

  return (
    <>
      <Box height="100vh" paddingTop={["3", "20"]} maxWidth="90%" margin="auto">
        <Wrap justify="center" spacing={["12px", "60px"]}>
          {otherPlayers.map((player) => (
            <WrapItem key={player.id}>
              <PlayerHand isTurn={currentPlayerTurn?.id === player.id} player={player} />
            </WrapItem>
          ))}
        </Wrap>
        <HStack
          bottom={["16", "20"]}
          position="absolute"
          spacing={["9px", "60px"]}
          width="100%"
          justifyContent="center"
          insetX="0"
        >
          <PlayerHand isTurn={currentPlayerTurn?.id === currentPlayer.id} player={currentPlayer} isCurrentPlayer />
          <Actions otherPlayers={otherPlayers} />
        </HStack>
      </Box>
      <Tooltip label="Help">
        <IconButton
          aria-label="Help"
          variant="unstyled"
          position="absolute"
          width={["14", "20"]}
          height="fit-content"
          right={["2", "5"]}
          bottom={["2", "5"]}
          icon={<HelpIcon/>}
          onClick={() => onOpen()}
        />
      </Tooltip>
      <GameModalChooser />
      <GameHelpSidebar open={isOpen} onClose={onClose} />
    </>
  );
};

export default Game;
