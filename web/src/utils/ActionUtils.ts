import type { ThemeTypings } from "@chakra-ui/react";
import { Actions, CounterActions, Influence } from "@contexts/GameStateContext";
import { AxeIcon, CoinIcon, AssassinIcon } from "@icons";
import { InfluenceDetails } from "./InfluenceUtils";

export interface IActionDetails {
  blockable: Readonly<Array<Influence> | null>;
  challengable: Readonly<boolean>;
  color: Readonly<ThemeTypings["colors"]>;
  counterAction: CounterActions | null;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const ActionDetails: Record<Actions, IActionDetails> = {
  [Actions.Aid]: {
    blockable: ["Duke"],
    challengable: false,
    color: "teal.300",
    counterAction: CounterActions.BlockAid,
    icon: CoinIcon,
  },
  [Actions.Assassinate]: {
    blockable: ["Contessa"],
    challengable: true,
    color: InfluenceDetails["Assassin"].color,
    counterAction: CounterActions.BlockAssassination,
    icon: AssassinIcon,
  },
  [Actions.Coup]: { blockable: null, challengable: false, color: "red.300", counterAction: null, icon: AxeIcon },
  [Actions.Exchange]: {
    blockable: null,
    challengable: true,
    color: InfluenceDetails["Ambassador"].color,
    counterAction: null,
    icon: CoinIcon,
  },
  [Actions.Income]: { blockable: null, challengable: false, color: "teal.300", counterAction: null, icon: CoinIcon },
  [Actions.Steal]: {
    blockable: ["Captain", "Ambassador"],
    challengable: true,
    color: InfluenceDetails["Captain"].color,
    counterAction: CounterActions.BlockSteal,
    icon: CoinIcon,
  },
  [Actions.Tax]: {
    blockable: null,
    challengable: true,
    color: InfluenceDetails["Duke"].color,
    counterAction: null,
    icon: CoinIcon,
  },
};
