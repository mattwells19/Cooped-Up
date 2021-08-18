import type { ThemeTypings } from "@chakra-ui/react";
import { CounterActions } from "@contexts/GameStateContext";
import { BlockIcon } from "@icons/actions";
import { InfluenceDetails } from "./InfluenceUtils";

export interface ICounterActionDetails {
  challengable: Readonly<boolean>;
  color: Readonly<ThemeTypings["colors"]>;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const CounterActionDetails: Record<CounterActions, ICounterActionDetails> = {
  [CounterActions.BlockAid]: { challengable: true, color: InfluenceDetails["Duke"].color, icon: BlockIcon },
  [CounterActions.BlockAssassination]: {
    challengable: true,
    color: InfluenceDetails["Contessa"].color,
    icon: BlockIcon,
  },
  [CounterActions.BlockSteal]: { challengable: true, color: "teal.300", icon: BlockIcon },
};
