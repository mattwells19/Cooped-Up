import { Actions, Influence } from "@contexts/GameStateContext/types";

const InfluenceValidActions: Record<Influence, Actions | null> = {
  Duke: Actions.Tax,
  Captain: Actions.Steal,
  Ambassador: Actions.Exchange,
  Assassin: Actions.Assassinate,
  Contessa: null,
};

export function wasValidAction(influence: Influence, action: Actions): boolean {
  if (action === Actions.Coup || action === Actions.Income) return true;
  return InfluenceValidActions[influence] === action;
}

export function getInfluenceFromAction(action: Actions): Influence {
  const foundKey = Object.keys(InfluenceValidActions).find((key) => InfluenceValidActions[key as Influence] === action);
  if (!foundKey) throw new Error(`Invalid action ${action}.`);
  return foundKey as Influence;
}
