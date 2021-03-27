import { Button, Wrap, WrapItem, ButtonProps, WrapProps } from "@chakra-ui/react";
import * as React from "react";
import { getPlayerById } from "../../../contexts/GameStateContext/Actions";
import { useGameState } from "../../../contexts/GameStateContext/GameStateContext";
import { Actions } from "../../../contexts/GameStateContext/types";

interface IWrappedButtonProps extends Omit<ButtonProps, "width"> {
  actionPayload?: { action: Actions, victimId: string | null };
}

interface IActionButtonsProps extends WrapProps {
  handleShowPlayerList: () => void;
}

const ActionButtons: React.FC<IActionButtonsProps> = ({ handleShowPlayerList, ...props }) => {
  const { handleGameEvent, currentPlayerId, turn, players } = useGameState();

  const currentPlayer = getPlayerById(players, currentPlayerId).player;
  if (!currentPlayer) throw new Error(`No player was found with the id ${currentPlayerId}.`);

  const isTurn = currentPlayerId.localeCompare(turn) === 0;

  const WrappedButton: React.FC<IWrappedButtonProps> = ({ actionPayload, children, disabled, ...buttonProps }) => (
    <WrapItem>
      <Button
        disabled={!isTurn || disabled}
        onClick={() => handleGameEvent({
          event: "ACTION",
          eventPayload: actionPayload,
        })}
        width="130px"
        {...buttonProps}
      >
        {children}
      </Button>
    </WrapItem>
  );

  return (
    <Wrap
      align="center"
      justify="space-evenly"
      padding="3"
      {...props}
    >
      <WrappedButton colorScheme="purple" disabled={currentPlayer.coins >= 10}>Collect Tax</WrappedButton>
      <WrappedButton colorScheme="blue" disabled={currentPlayer.coins >= 10}>Steal</WrappedButton>
      <WrappedButton colorScheme="gray" disabled={currentPlayer.coins >= 10}>Assassinate</WrappedButton>
      <WrappedButton colorScheme="green" disabled={currentPlayer.coins >= 10}>Exchange</WrappedButton>
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
      <WrappedButton variant="outline" disabled={currentPlayer.coins >= 10}>Foreign Aid</WrappedButton>
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
