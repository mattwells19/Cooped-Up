import type { ThemeTypings } from "@chakra-ui/react";
import { Actions, Influence } from "@contexts/GameStateContext";
import { AxeIcon, CoinIcon, AssassinIcon } from "@icons";
import { InfluenceDetails } from "./InfluenceUtils";

export interface IActionDetails {
  blockable: Readonly<Array<Influence> | null>;
  challengable: Readonly<boolean>;
  color: Readonly<ThemeTypings["colors"]>;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const ActionDetails: Record<Actions, IActionDetails> = {
  [Actions.Aid]: { blockable: ["Duke"], challengable: false, color: "teal.300", icon: CoinIcon },
  [Actions.Assassinate]: {
    blockable: ["Contessa"],
    challengable: true,
    color: InfluenceDetails["Assassin"].color,
    icon: AssassinIcon,
  },
  [Actions.Coup]: { blockable: null, challengable: false, color: "red.300", icon: AxeIcon },
  [Actions.Exchange]: {
    blockable: null,
    challengable: true,
    color: InfluenceDetails["Ambassador"].color,
    icon: CoinIcon,
  },
  [Actions.Income]: { blockable: null, challengable: false, color: "teal.300", icon: CoinIcon },
  [Actions.Steal]: {
    blockable: ["Captain", "Ambassador"],
    challengable: true,
    color: InfluenceDetails["Captain"].color,
    icon: CoinIcon,
  },
  [Actions.Tax]: { blockable: null, challengable: true, color: InfluenceDetails["Duke"].color, icon: CoinIcon },
  [Actions.Block]: { blockable: null, challengable: true, color: "pink.300", icon: CoinIcon },
};
