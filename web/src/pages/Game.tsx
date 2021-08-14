import * as React from "react";
import { useDisclosure, IconButton, Tooltip, Flex } from "@chakra-ui/react";
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
  const isTurn = Boolean(currentPlayerTurn?.id === currentPlayer.id);

  React.useLayoutEffect(() => {
    if (isTurn) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [isTurn]);

  return (
    <>
      <Flex
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
        gridGap={["3", "12"]}
        alignItems="flex-start"
        minHeight={["calc(60vh - 12px)", "calc(60vh - 50px)"]}
        paddingTop={["3", "20"]}
        margin="auto"
        overflow="auto"
      >
        {otherPlayers.map((player) => (
          <PlayerHand
            width="40vw"
            maxWidth="325px"
            isTurn={currentPlayerTurn?.id === player.id}
            player={player}
            key={player.id}
          />
        ))}
      </Flex>
      <Flex
        gridGap={["3", "12"]}
        padding={["3", "12"]}
        margin="auto"
        alignItems="stretch"
        justifyContent="center"
        flexWrap="wrap"
      >
        <PlayerHand
          width={["75%", "420px"]}
          isTurn={isTurn}
          player={currentPlayer}
          isCurrentPlayer
        />
        <Actions
          width={["75%", "420px"]}
          minHeight="225px"
          otherPlayers={otherPlayers}
        />
      </Flex>
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
