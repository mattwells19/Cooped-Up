import type { ThemeTypings } from "@chakra-ui/react";
import { Actions, CounterActions } from "@contexts/GameStateContext";
import { CoinIcon } from "@icons";
import { getInfluenceFromAction, InfluenceDetails } from "./InfluenceUtils";

export interface ICounterActionDetails {
  challengable: Readonly<boolean>;
  color: Readonly<ThemeTypings["colors"]>;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const CounterActionDetails: Record<CounterActions, ICounterActionDetails> = {
  [CounterActions.BlockAid]: { challengable: true, color: InfluenceDetails["Duke"].color, icon: CoinIcon },
  [CounterActions.BlockAssassination]: {
    challengable: true,
    color: InfluenceDetails["Contessa"].color,
    icon: CoinIcon,
  },
  [CounterActions.BlockSteal]: { challengable: true, color: "teal.300", icon: CoinIcon },
};

export function getCounterActionFromAction(action: Actions): CounterActions | null {
  const influence = getInfluenceFromAction(action);
  if (!influence) throw new Error("No influence for that action.");
  return InfluenceDetails[influence].counterAction;
}
