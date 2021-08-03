import { Actions, Influence } from "@contexts/GameStateContext";
import { ActionDetails } from "@utils/ActionUtils";

export interface IInfluenceDetails {
  description: string;
  name: string;
  blockedBy: ReadonlyArray<Influence> | null;
}

const influenceDetails = new Map<Influence, Array<IInfluenceDetails>>([
  [
    "Ambassador",
    [
      {
        blockedBy: ActionDetails[Actions.Exchange].blockable,
        description: "Exchange two cards with the deck.",
        name: "Exchange",
      },
      {
        blockedBy: null,
        description: "Blocks a Captain from stealing from you.",
        name: "Block Steal",
      },
    ],
  ],
  [
    "Assassin",
    [
      {
        blockedBy: ActionDetails[Actions.Assassinate].blockable,
        description: "Pay 3 coins to make a player lose an influence.",
        name: "Assassinate",
      },
    ],
  ],
  [
    "Captain",
    [
      {
        blockedBy: ActionDetails[Actions.Steal].blockable,
        description: "Steal two coins from another player.",
        name: "Steal",
      },
      {
        blockedBy: null,
        description: "Blocks another Captain from stealing from you.",
        name: "Block Steal",
      },
    ],
  ],
  [
    "Contessa",
    [
      {
        blockedBy: null,
        description: "Blocks an Assassin from assassinating you.",
        name: "Block Assassination",
      },
    ],
  ],
  [
    "Duke",
    [
      {
        blockedBy: null,
        description: "Collect 3 coins.",
        name: "Collect Tax",
      },
      {
        blockedBy: null,
        description: "",
        name: "Block Foreign Aid",
      },
    ],
  ],
]);

export default influenceDetails;
