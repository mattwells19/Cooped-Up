import { Influence } from "./types";

const alphabet: Array<string> = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const startingDeck: Influence[] = [
  ...Array(3).fill(Influence.Duke),
  ...Array(3).fill(Influence.Captain),
  ...Array(3).fill(Influence.Ambassador),
  ...Array(3).fill(Influence.Assassin),
  ...Array(3).fill(Influence.Contessa),
];

export { alphabet, startingDeck };
