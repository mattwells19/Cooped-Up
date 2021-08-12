import type { ThemeTypings } from "@chakra-ui/react";
import { Actions, CounterActions, Influence } from "@contexts/GameStateContext/types";
import { AmbassadorImg, AssassinImg, CaptainImg, ContessaImg, DukeImg } from "@icons";
import type { FC, SVGProps } from "react";

export interface IInfluenceDetails {
  img: FC<SVGProps<SVGSVGElement>>;
  action: Actions | null;
  counterAction: CounterActions | null;
  color: ThemeTypings["colors"];
  colorScheme: ThemeTypings["colorSchemes"];
}

export const InfluenceDetails: Record<Influence, IInfluenceDetails> = {
  Ambassador: {
    action: Actions.Exchange,
    color: "green.300",
    colorScheme: "green",
    counterAction: CounterActions.BlockSteal,
    img: AmbassadorImg,
  },
  Assassin: {
    action: Actions.Assassinate,
    color: "gray.300",
    colorScheme: "gray",
    counterAction: null,
    img: AssassinImg,
  },
  Captain: {
    action: Actions.Steal,
    color: "blue.300",
    colorScheme: "blue",
    counterAction: CounterActions.BlockSteal,
    img: CaptainImg,
  },
  Contessa: {
    action: null,
    color: "orange.300",
    colorScheme: "orange",
    counterAction: CounterActions.BlockAssassination,
    img: ContessaImg,
  },
  Duke: {
    action: Actions.Tax,
    color: "purple.300",
    colorScheme: "purple",
    counterAction: CounterActions.BlockAid,
    img: DukeImg,
  },
};

export function wasValidAction(influence: Influence, action: Actions): boolean {
  if (action === Actions.Coup || action === Actions.Income || action === Actions.Aid) return true;
  return InfluenceDetails[influence].action === action;
}

export function getInfluenceFromAction(action: Actions): Influence | undefined {
  const InfluenceDetailsKeys = Object.keys(InfluenceDetails) as Array<Influence>;
  const foundKey = InfluenceDetailsKeys.find((key) => InfluenceDetails[key].action === action);
  return foundKey;
}
