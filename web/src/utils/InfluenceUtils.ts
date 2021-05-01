import type { ThemeTypings } from "@chakra-ui/react";
import { Actions, Influence } from "@contexts/GameStateContext/types";
import { AmbassadorImg, AssassinImg, CaptainImg, ContessaImg, DukeImg } from "@images/InfluenceImages";

export interface IInfluenceDetails {
  img: string;
  actions: Array<Actions>;
  color: string;
  colorScheme: ThemeTypings["colorSchemes"];
}

export const InfluenceDetails: Record<Influence, IInfluenceDetails> = {
  Ambassador: { img: AmbassadorImg, actions: [Actions.Exchange], color: "green.300", colorScheme: "green" },
  Assassin: { img: AssassinImg, actions: [Actions.Assassinate], color: "green.300", colorScheme: "green" },
  Captain: { img: CaptainImg, actions: [Actions.Steal], color: "blue.300", colorScheme: "blue" },
  Contessa: { img: ContessaImg, actions: [], color: "orange.300", colorScheme: "orange" },
  Duke: { img: DukeImg, actions: [Actions.Tax], color: "purple.300", colorScheme: "purple" },
};

export function wasValidAction(influence: Influence, action: Actions): boolean {
  if (action === Actions.Coup || action === Actions.Income) return true;
  return InfluenceDetails[influence].actions.includes(action);
}

export function getInfluencesFromAction(action: Actions): Array<Influence> {
  const InfluenceDetailsKeys = Object.keys(InfluenceDetails) as Array<Influence>;
  const foundKey = InfluenceDetailsKeys.filter((key) => InfluenceDetails[key].actions.includes(action));
  return foundKey;
}
