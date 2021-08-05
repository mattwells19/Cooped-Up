import { Actions, CounterActions, Influence } from "@contexts/GameStateContext";
import { ActionDetails } from "@utils/ActionUtils";

export interface IInfluenceHelpDetails {
  actions: Array<IActionHelpDetails>;
}

export interface IActionHelpDetails {
  description: string;
  name: string;
  blockedBy: ReadonlyArray<Influence> | null;
}

const actionHelpDetails: Readonly<Record<Actions | CounterActions, IActionHelpDetails>> = {
  [Actions.Coup]: {
    blockedBy: ActionDetails[Actions.Coup].blockable,
    description: "Pay 7 coins and choose a player to lose an influence. You are forced to Coup with 10+ coins.",
    name: "Coup",
  },
  [Actions.Aid]: {
    blockedBy: ActionDetails[Actions.Aid].blockable,
    description: "Collect 2 coins.",
    name: "Foreign Aid",
  },
  [Actions.Income]: {
    blockedBy: ActionDetails[Actions.Income].blockable,
    description: "Collect 1 coin.",
    name: "Income",
  },
  [Actions.Exchange]: {
    blockedBy: ActionDetails[Actions.Exchange].blockable,
    description: "Exchange two cards with the deck.",
    name: "Exchange",
  },
  [Actions.Assassinate]: {
    blockedBy: ActionDetails[Actions.Assassinate].blockable,
    description: "Pay 3 coins to make a player lose an influence.",
    name: "Assassinate",
  },
  [Actions.Steal]: {
    blockedBy: ActionDetails[Actions.Steal].blockable,
    description: "Steal two coins from another player.",
    name: "Steal",
  },
  [Actions.Tax]: {
    blockedBy: ActionDetails[Actions.Tax].blockable,
    description: "Collect 3 coins.",
    name: "Collect Tax",
  },
  [CounterActions.BlockSteal]: {
    blockedBy: null,
    description: "Blocks a Captain from stealing from you.",
    name: "Block Steal",
  },
  [CounterActions.BlockAssassination]: {
    blockedBy: null,
    description: "Blocks an Assassin from assassinating you.",
    name: "Block Assassination",
  },
  [CounterActions.BlockAid]: {
    blockedBy: null,
    description: "Blocks a player from collecting foreign aid.",
    name: "Block Foreign Aid",
  },
};

export { actionHelpDetails };
