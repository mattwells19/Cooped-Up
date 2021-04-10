import { Text, useColorModeValue, VStack } from "@chakra-ui/react";
import * as React from "react";
import { Actions as InfluenceActions, IPlayer } from "@contexts/GameStateContext/types";
import { useGameState } from "@contexts/GameStateContext/GameStateContext";
import PlayerSelect from "./components/PlayerSelect";
import ActionButtons from "./components/ActionButtons";

interface IActionsProps {
  otherPlayers: Array<IPlayer>;
}

const Actions: React.FC<IActionsProps> = ({ otherPlayers }) => {
  const { handleGameEvent, currentPlayerId, turn } = useGameState();
  const isTurn = currentPlayerId.localeCompare(turn) === 0;
  const [showPlayerSelect, setShowPlayerSelect] = React.useState<boolean>(false);

  const getActionsText = () => {
    if (showPlayerSelect) return "Choose a player to coup.";
    if (isTurn) return "It's your turn! Pick an action.";
    return "It's not your turn.";
  };

  const commonStyles = {
    backgroundColor: useColorModeValue("gray.200", "gray.700"),
    borderRadius: "10px",
    height: "280px",
    width: "324px",
    sx: {
      ul: {
        height: "100%",
      },
    },
  };

  return (
    <VStack>
      <Text fontSize="lg" alignSelf="flex-start">
        {getActionsText()}
      </Text>
      {!showPlayerSelect && (
        <ActionButtons handleShowPlayerList={() => setShowPlayerSelect(true)} {...commonStyles} />
      )}
      {showPlayerSelect && (
        <PlayerSelect
          onSelection={(victimId: string) => {
            setShowPlayerSelect(false);
            handleGameEvent({
              event: "ACTION",
              eventPayload: {
                action: InfluenceActions.Coup,
                performerId: currentPlayerId,
                victimId,
              },
            });
          }}
          players={otherPlayers}
          {...commonStyles}
        />
      )}
    </VStack>
  );
};

export default Actions;
