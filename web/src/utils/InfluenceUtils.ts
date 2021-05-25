import type { ThemeTypings } from "@chakra-ui/react";
import { Actions, Influence } from "@contexts/GameStateContext/types";
import { AmbassadorImg, AssassinImg, CaptainImg, ContessaImg, DukeImg } from "@images/InfluenceImages";

export interface IInfluenceDetails {
  img: string;
  action: Actions | null;
  color: string;
  colorScheme: ThemeTypings["colorSchemes"];
}

export const InfluenceDetails: Record<Influence, IInfluenceDetails> = {
  Ambassador: { img: AmbassadorImg, action: Actions.Exchange, color: "green.300", colorScheme: "green" },
  Assassin: { img: AssassinImg, action: Actions.Assassinate, color: "green.300", colorScheme: "green" },
  Captain: { img: CaptainImg, action: Actions.Steal, color: "blue.300", colorScheme: "blue" },
  Contessa: { img: ContessaImg, action: null, color: "orange.300", colorScheme: "orange" },
  Duke: { img: DukeImg, action: Actions.Tax, color: "purple.300", colorScheme: "purple" },
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
