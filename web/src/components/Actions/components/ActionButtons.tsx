import { Button, Wrap, WrapItem, ButtonProps, WrapProps } from "@chakra-ui/react";
import * as React from "react";
import { Actions, IPlayer } from "@contexts/GameStateContext";
import { InfluenceDetails } from "@utils/InfluenceUtils";

interface IWrappedButtonProps extends Omit<ButtonProps, "width"> {
  action: Actions;
}

interface IActionButtonsProps extends WrapProps {
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
  ...props
}) => {
  const canSteal = React.useMemo(() => {
    return players.some((player) => (
      player.influences.some((influence) => !influence.isDead) && player.coins > 0
    ));
  }, [players]);

  const WrappedButton: React.FC<IWrappedButtonProps> = ({ action, children, disabled, ...buttonProps }) => (
    <WrapItem>
      <Button
        disabled={!isTurn || disabled}
        onClick={() => !disabled ? onAction(action) : null}
        width={["68px", "130px"]}
        height={["21px", "40px"]}
        fontSize={["xs", "inherit"]}
        {...buttonProps}
      >
        {children}
      </Button>
    </WrapItem>
  );

  return (
    <Wrap align="center" justify="space-evenly" spacing={["1", "2"]} padding={["1", "3"]} {...props}>
      <WrappedButton
        action={Actions.Tax}
        colorScheme={InfluenceDetails["Duke"].colorScheme}
        disabled={coinCount >= 10}
      >
        Collect Tax
      </WrappedButton>
      <WrappedButton
        action={Actions.Steal}
        colorScheme={InfluenceDetails["Captain"].colorScheme}
        disabled={coinCount >= 10 || !canSteal}
      >
        Steal
      </WrappedButton>
      <WrappedButton
        action={Actions.Assassinate}
        colorScheme={InfluenceDetails["Assassin"].colorScheme}
        disabled={coinCount >= 10 || coinCount < 3}
      >
        Assassinate
      </WrappedButton>
      <WrappedButton
        action={Actions.Exchange}
        colorScheme={InfluenceDetails["Ambassador"].colorScheme}
        disabled={coinCount >= 10}
      >
        Exchange
      </WrappedButton>
      <WrappedButton
        action={Actions.Income}
        disabled={coinCount >= 10}
        variant="outline"
      >
        Income
      </WrappedButton>
      <WrappedButton
        action={Actions.Aid}
        variant="outline"
        disabled={coinCount >= 10}
      >
        Foreign Aid
      </WrappedButton>
      <WrappedButton
        action={Actions.Coup}
        colorScheme="red"
        disabled={coinCount < 7}
      >
        Coup
      </WrappedButton>
    </Wrap>
  );
};

export default ActionButtons;
