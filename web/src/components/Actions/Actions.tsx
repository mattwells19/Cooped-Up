import { Text, useColorModeValue, VStack } from "@chakra-ui/react";
import * as React from "react";
import { Actions as InfluenceActions, IPlayer, useGameState } from "@contexts/GameStateContext";
import PlayerSelect from "./components/PlayerSelect";
import ActionButtons from "./components/ActionButtons";

interface IActionsProps {
  otherPlayers: Array<IPlayer>;
}

interface IPlayerSelectableAction {
  action: InfluenceActions;
  isPlayerValidChoice: (player: IPlayer) => boolean;
}

const Actions: React.FC<IActionsProps> = ({ otherPlayers }) => {
  const { handleGameEvent, currentPlayer, currentPlayerTurn } = useGameState();

  const isTurn = currentPlayer.id.localeCompare(currentPlayerTurn?.id ?? "") === 0;
  const [playerSelectableAction, setPlayerSelectableAction] = React.useState<IPlayerSelectableAction | null>(null);

  const getActionsText = () => {
    if (playerSelectableAction) {
      switch(playerSelectableAction.action) {
        case InfluenceActions.Steal:
          return "Choose a player to steal from.";
        default:
          return `Choose a player to ${playerSelectableAction.action}.`;
      }
    }
    else if (isTurn) return "It's your turn! Pick an action.";
    else return "It's not your turn.";
  };

  const commonStyles = {
    backgroundColor: useColorModeValue("gray.200", "gray.700"),
    borderRadius: "10px",
    sx: {
      ul: {
        height: ["112px", "270px"],
      },
    },
    width: ["158px", "324px"],
  };

  const validPlayersToStealFrom = (p: IPlayer): boolean => p.coins > 0 && p.influences.some((i) => !i.isDead);
  const validPlayersToLoseAnInfluence = (p: IPlayer): boolean => p.influences.some((i) => !i.isDead);

  return (
    <VStack spacing={["2px", "4px"]}>
      <Text maxWidth={commonStyles.width} fontSize={["sm", "lg"]} alignSelf="flex-start">
        {getActionsText()}
      </Text>
      {!playerSelectableAction && (
        <ActionButtons
          onAction={(action: InfluenceActions) => {
            switch(action) {
              case InfluenceActions.Assassinate:
              case InfluenceActions.Coup:
                setPlayerSelectableAction({ action, isPlayerValidChoice: validPlayersToLoseAnInfluence  });
                break;
              case InfluenceActions.Steal:
                setPlayerSelectableAction({ action, isPlayerValidChoice: validPlayersToStealFrom });
                break;
              default:
                handleGameEvent({
                  event: "ACTION",
                  eventPayload: {
                    action,
                    performerId: currentPlayerTurn?.id,
                  },
                });
            }
          }}
          players={otherPlayers}
          coinCount={currentPlayer.coins}
          isTurn={isTurn}
          {...commonStyles}
        />
      )}
      {playerSelectableAction && (
        <PlayerSelect
          onSelection={(victimId: string) => {
            handleGameEvent({
              event: "ACTION",
              eventPayload: {
                action: playerSelectableAction.action,
                performerId: currentPlayerTurn?.id,
                victimId,
              },
            });
            setPlayerSelectableAction(null);
          }}
          isPlayerSelectable={playerSelectableAction.isPlayerValidChoice}
          players={otherPlayers}
          {...commonStyles}
        />
      )}
    </VStack>
  );
};

export default Actions;
