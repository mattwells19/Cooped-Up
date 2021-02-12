import * as _ from "lodash";
import type { IPlayerInfluence } from "../hooks/useGameState";

const startingDeck: Array<IPlayerInfluence> = [
  {
    type: "Duke",
    isDead: false,
  },
  {
    type: "Duke",
    isDead: false,
  },
  {
    type: "Duke",
    isDead: false,
  },
  {
    type: "Captain",
    isDead: false,
  },
  {
    type: "Captain",
    isDead: false,
  },
  {
    type: "Captain",
    isDead: false,
  },
  {
    type: "Ambassador",
    isDead: false,
  },
  {
    type: "Ambassador",
    isDead: false,
  },
  {
    type: "Ambassador",
    isDead: false,
  },
  {
    type: "Assassin",
    isDead: false,
  },
  {
    type: "Assassin",
    isDead: false,
  },
  {
    type: "Assassin",
    isDead: false,
  },
  {
    type: "Contessa",
    isDead: false,
  },
  {
    type: "Contessa",
    isDead: false,
  },
  {
    type: "Contessa",
    isDead: false,
  },
  {
    type: "Inquisitor",
    isDead: false,
  },
  {
    type: "Inquisitor",
    isDead: false,
  },
  {
    type: "Inquisitor",
    isDead: false,
  },
];

class Deck {
  cards: Array<IPlayerInfluence> = [];

  constructor() {
    this.cards = startingDeck;
  }

  shuffle() {
    this.cards = _.shuffle(this.cards);
  }

  toString() {
    return this.cards.map((card) => card.type.toString());
  }
}

export default new Deck();
