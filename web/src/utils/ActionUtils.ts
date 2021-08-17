import type { ThemeTypings } from "@chakra-ui/react";
import { Actions, CounterActions, Influence } from "@contexts/GameStateContext";
import { AssassinateIcon, AidIcon, CoupIcon, ExchangeIcon, IncomeIcon, StealIcon, TaxIcon } from "@icons/actions";
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
    icon: AidIcon,
  },
  [Actions.Assassinate]: {
    blockable: ["Contessa"],
    challengable: true,
    color: InfluenceDetails["Assassin"].color,
    counterAction: CounterActions.BlockAssassination,
    icon: AssassinateIcon,
  },
  [Actions.Coup]: { blockable: null, challengable: false, color: "red.300", counterAction: null, icon: CoupIcon },
  [Actions.Exchange]: {
    blockable: null,
    challengable: true,
    color: InfluenceDetails["Ambassador"].color,
    counterAction: null,
    icon: ExchangeIcon,
  },
  [Actions.Income]: { blockable: null, challengable: false, color: "teal.300", counterAction: null, icon: IncomeIcon },
  [Actions.Steal]: {
    blockable: ["Captain", "Ambassador"],
    challengable: true,
    color: InfluenceDetails["Captain"].color,
    counterAction: CounterActions.BlockSteal,
    icon: StealIcon,
  },
  [Actions.Tax]: {
    blockable: null,
    challengable: true,
    color: InfluenceDetails["Duke"].color,
    counterAction: null,
    icon: TaxIcon,
  },
};

export function getActionFromCounterAction(counterAction: CounterActions): Actions | undefined {
  const ActionDetailsKeys = Object.keys(ActionDetails) as Array<Actions>;
  const foundKey = ActionDetailsKeys.find((key) => ActionDetails[key].counterAction === counterAction);
  return foundKey;
}
