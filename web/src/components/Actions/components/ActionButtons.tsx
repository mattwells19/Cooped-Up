import { Button, Wrap, WrapItem, ButtonProps, WrapProps } from "@chakra-ui/react";
import * as React from "react";
import { useGameState, Actions } from "@contexts/GameStateContext";
import { usePlayers } from "@contexts/PlayersContext";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";

interface IWrappedButtonProps extends Omit<ButtonProps, "width"> {
  actionPayload?: { action: Actions; victimId: string | null };
}

interface IActionButtonsProps extends WrapProps {
  handleShowPlayerList: () => void;
}

const ActionButtons: React.FC<IActionButtonsProps> = ({ handleShowPlayerList, ...props }) => {
  const { handleGameEvent, currentPlayerId, turn } = useGameState();
  const { getPlayerById } = usePlayers();

  const currentPlayer = getPlayerById(currentPlayerId)?.player;
  if (!currentPlayer) throw new PlayerNotFoundError(currentPlayerId);

  const isTurn = currentPlayerId.localeCompare(turn) === 0;

  const WrappedButton: React.FC<IWrappedButtonProps> = ({ actionPayload, children, disabled, ...buttonProps }) => (
    <WrapItem>
      <Button
        // every button will eventually have an actionPayload or onClick.
        // this is temporary to prevent a tester from crashing the app.
        disabled={!isTurn || (!actionPayload && !buttonProps.onClick) || disabled}
        onClick={() =>
          handleGameEvent({
            event: "ACTION",
            eventPayload: {
              ...actionPayload,
              performerId: currentPlayerId,
            },
          })
        }
        width="130px"
        {...buttonProps}
      >
        {children}
      </Button>
    </WrapItem>
  );

  return (
    <Wrap align="center" justify="space-evenly" padding="3" {...props}>
      <WrappedButton
        actionPayload={{
          action: Actions.Tax,
          victimId: null,
        }}
        colorScheme="purple"
        disabled={currentPlayer.coins >= 10}
      >
        Collect Tax
      </WrappedButton>
      <WrappedButton colorScheme="blue" disabled={currentPlayer.coins >= 10}>
        Steal
      </WrappedButton>
      <WrappedButton colorScheme="gray" disabled={currentPlayer.coins >= 10}>
        Assassinate
      </WrappedButton>
      <WrappedButton colorScheme="green" disabled={currentPlayer.coins >= 10}>
        Exchange
      </WrappedButton>
      <WrappedButton
        actionPayload={{
          action: Actions.Income,
          victimId: null,
        }}
        disabled={currentPlayer.coins >= 10}
        variant="outline"
      >
        Income
      </WrappedButton>
      <WrappedButton
        actionPayload={{
          action: Actions.Aid,
          victimId: null,
        }}
        variant="outline"
        disabled={currentPlayer.coins >= 10}
      >
        Foreign Aid
      </WrappedButton>
      <WrappedButton
        onClick={() => {
          if (currentPlayer.coins >= 7) handleShowPlayerList();
        }}
        colorScheme="red"
        disabled={currentPlayer.coins < 7}
      >
        Coup
      </WrappedButton>
    </Wrap>
  );
};

export default ActionButtons;
