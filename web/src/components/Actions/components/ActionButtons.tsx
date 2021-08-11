import { Button, ButtonProps, Box } from "@chakra-ui/react";
import * as React from "react";
import { Actions, IPlayer } from "@contexts/GameStateContext";
import { InfluenceDetails } from "@utils/InfluenceUtils";

interface IActionButtonProps extends ButtonProps {
  action: Actions;
}

interface IActionButtonsProps {
  onAction: (action: Actions) => void;
  isTurn: boolean;
  coinCount: number;
  players: Array<IPlayer>;
}

const ActionButtons: React.FC<IActionButtonsProps> = ({
  coinCount,
  onAction,
  players,
  isTurn,
}) => {
  const canSteal = React.useMemo(() => {
    return players.some((player) => (
      player.influences.some((influence) => !influence.isDead) && player.coins > 0
    ));
  }, [players]);

  const ActionButton: React.FC<IActionButtonProps> = ({ action, children, disabled, ...buttonProps }) => (
    <Button
      disabled={!isTurn || disabled}
      onClick={() => !disabled ? onAction(action) : null}
      fontSize={["md", "lg"]}
      height="auto"
      whiteSpace="normal"
      {...buttonProps}
    >
      {children}
    </Button>
  );

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(2, 1fr)"
      gridTemplateRows="repeat(4, 1fr)"
      justifyItems="stretch"
      alignItems="stretch"
      gridGap={["1", "1", "1", "3"]}
      padding={["1", "1", "1", "3"]}
      height="100%"
    >
      <ActionButton
        action={Actions.Tax}
        colorScheme={InfluenceDetails["Duke"].colorScheme}
        disabled={coinCount >= 10}
      >
        Collect Tax
      </ActionButton>
      <ActionButton
        action={Actions.Steal}
        colorScheme={InfluenceDetails["Captain"].colorScheme}
        disabled={coinCount >= 10 || !canSteal}
      >
        Steal
      </ActionButton>
      <ActionButton
        action={Actions.Assassinate}
        colorScheme={InfluenceDetails["Assassin"].colorScheme}
        disabled={coinCount >= 10 || coinCount < 3}
      >
        Assassinate
      </ActionButton>
      <ActionButton
        action={Actions.Exchange}
        colorScheme={InfluenceDetails["Ambassador"].colorScheme}
        disabled={coinCount >= 10}
      >
        Exchange
      </ActionButton>
      <ActionButton
        action={Actions.Income}
        disabled={coinCount >= 10}
        variant="outline"
      >
        Income
      </ActionButton>
      <ActionButton
        action={Actions.Aid}
        variant="outline"
        disabled={coinCount >= 10}
      >
        Foreign Aid
      </ActionButton>
      <ActionButton
        action={Actions.Coup}
        colorScheme="red"
        disabled={coinCount < 7}
        gridColumn="1 / 3"
      >
        Coup
      </ActionButton>
    </Box>
  );
};

export default ActionButtons;
