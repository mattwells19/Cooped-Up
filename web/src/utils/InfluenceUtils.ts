import { Actions, Influence } from "@contexts/GameStateContext/types";
import { AmbassadorImg, AssassinImg, CaptainImg, ContessaImg, DukeImg } from "@images/InfluenceImages";
import theme from "@utils/theme";

export interface IInfluenceDetails {
  img: string;
  actions: Array<Actions>;
  color: string;
}

export const InfluenceDetails: Record<Influence, IInfluenceDetails> = {
  Ambassador: { img: AmbassadorImg, actions: [Actions.Exchange], color: theme.colors.green["300"] },
  Assassin: { img: AssassinImg, actions: [Actions.Assassinate], color: theme.colors.gray["300"] },
  Captain: { img: CaptainImg, actions: [Actions.Steal], color: theme.colors.blue["300"] },
  Contessa: { img: ContessaImg, actions: [], color: theme.colors.orange["300"] },
  Duke: { img: DukeImg, actions: [Actions.Tax], color: theme.colors.purple["300"] },
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
