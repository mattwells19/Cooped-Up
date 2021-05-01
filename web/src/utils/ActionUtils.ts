import { Actions, Influence } from "@contexts/GameStateContext";

export interface IActionDetails {
  blockable: Readonly<Array<Influence> | null>;
  challengable: Readonly<boolean>;
}

export const ActionDetails: Record<Actions, IActionDetails> = {
  [Actions.Aid]: { blockable: ["Duke"], challengable: false },
  [Actions.Assassinate]: { blockable: ["Contessa"], challengable: true },
  [Actions.Coup]: { blockable: null, challengable: false },
  [Actions.Exchange]: { blockable: null, challengable: true },
  [Actions.Income]: { blockable: null, challengable: false },
  [Actions.Steal]: { blockable: ["Captain", "Ambassador"], challengable: true },
  [Actions.Tax]: { blockable: null, challengable: true },
  [Actions.Block]: { blockable: null, challengable: true },
};
