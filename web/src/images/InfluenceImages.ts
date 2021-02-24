import type { Influence } from "../contexts/GameStateContext/types";
import Ambassador from "./Ambassador.png";
import Assassin from "./Assassin.png";
import Blank from "./Blank.png";
import Captain from "./Captain.png";
import Contessa from "./Contessa.png";
import Duke from "./Duke.png";
import Inquisitor from "./Inquisitor.png";

const InfluenceImages = new Map<Influence | "Blank", string>([
  ["Ambassador", Ambassador],
  ["Assassin", Assassin],
  ["Captain", Captain],
  ["Contessa", Contessa],
  ["Duke", Duke],
  ["Inquisitor", Inquisitor],
  ["Blank", Blank],
]);

export default InfluenceImages;