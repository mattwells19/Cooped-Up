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
  Ambassador: { action: Actions.Exchange, color: "green.300", colorScheme: "green", img: AmbassadorImg },
  Assassin: { action: Actions.Assassinate, color: "green.300", colorScheme: "green", img: AssassinImg },
  Captain: { action: Actions.Steal, color: "blue.300", colorScheme: "blue", img: CaptainImg },
  Contessa: { action: null, color: "orange.300", colorScheme: "orange", img: ContessaImg },
  Duke: { action: Actions.Tax, color: "purple.300", colorScheme: "purple", img: DukeImg },
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
