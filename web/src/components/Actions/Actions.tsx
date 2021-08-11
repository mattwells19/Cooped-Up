import { Box, Flex, FlexProps, Text } from "@chakra-ui/react";
import * as React from "react";
import { Actions as InfluenceActions, IPlayer, useGameState } from "@contexts/GameStateContext";
import PlayerSelect from "./components/PlayerSelect";
import ActionButtons from "./components/ActionButtons";

interface IActionsProps extends FlexProps {
  otherPlayers: Array<IPlayer>;
}

interface IPlayerSelectableAction {
  action: InfluenceActions;
  isPlayerValidChoice: (player: IPlayer) => boolean;
}

const Actions: React.FC<IActionsProps> = ({ otherPlayers, ...props }) => {
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

  const validPlayersToStealFrom = (p: IPlayer): boolean => p.coins > 0 && p.influences.some((i) => !i.isDead);
  const validPlayersToLoseAnInfluence = (p: IPlayer): boolean => p.influences.some((i) => !i.isDead);

  return (
    <Flex flexDirection="column" gridGap={["2px", "4px"]} {...props}>
      <Text maxWidth="100%" fontSize={["md", "lg"]} alignSelf="flex-start">
        {getActionsText()}
      </Text>
      <Box backgroundColor="gray.700" borderRadius="md" height="100%" width="100%">
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
          />
        )}
      </Box>
    </Flex>
  );
};

export default Actions;
