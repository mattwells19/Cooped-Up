import { Text, useColorModeValue, VStack } from "@chakra-ui/react";
import * as React from "react";
import { Actions as InfluenceActions, IPlayer, useGameState } from "@contexts/GameStateContext";
import PlayerSelect from "./components/PlayerSelect";
import ActionButtons from "./components/ActionButtons";

interface IActionsProps {
  otherPlayers: Array<IPlayer>;
}

const Actions: React.FC<IActionsProps> = ({ otherPlayers }) => {
  const { handleGameEvent, currentPlayerId, turn } = useGameState();
  const isTurn = currentPlayerId.localeCompare(turn) === 0;
  const [playerSelectableAction, setPlayerSelectableAction] = React.useState<InfluenceActions | null>(null);

  const getActionsText = () => {
    if (playerSelectableAction) {
      switch(playerSelectableAction) {
        case InfluenceActions.Steal:
          return "Choose a player to steal from.";
        default:
          return `Choose a player to ${playerSelectableAction}.`;
      }
    }
    else if (isTurn) return "It's your turn! Pick an action.";
    else return "It's not your turn.";
  };

  const commonStyles = {
    backgroundColor: useColorModeValue("gray.200", "gray.700"),
    borderRadius: "10px",
    height: "280px",
    sx: {
      ul: {
        height: "100%",
      },
    },
    width: "324px",
  };

  return (
    <VStack>
      <Text fontSize="lg" alignSelf="flex-start">
        {getActionsText()}
      </Text>
      {!playerSelectableAction && (
        <ActionButtons handleShowPlayerList={(action) => setPlayerSelectableAction(action)} {...commonStyles} />
      )}
      {playerSelectableAction && (
        <PlayerSelect
          onSelection={(victimId: string) => {
            handleGameEvent({
              event: "ACTION",
              eventPayload: {
                action: playerSelectableAction,
                performerId: currentPlayerId,
                victimId,
              },
            });
            setPlayerSelectableAction(null);
          }}
          players={otherPlayers.filter((player) => player.influences.some((i) => !i.isDead))}
          {...commonStyles}
        />
      )}
    </VStack>
  );
};

export default Actions;
