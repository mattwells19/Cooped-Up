import * as React from "react";
import { Image } from "@chakra-ui/react";
import type { Influence } from "../contexts/GameStateContext/types";
import InfluenceImages from "../images/InfluenceImages";

interface IInfluenceCardProps {
  faceUp: boolean;
  enlarge?: boolean;
  influence: Influence;
}

const InfluenceCard: React.FC<IInfluenceCardProps> = ({ influence, enlarge = false, faceUp }) => (
  <Image
    alt={faceUp ? influence.toString() : "Hidden Influence"}
    src={InfluenceImages.get(faceUp ? influence : "Blank")}
    htmlWidth={enlarge ? "200px" : "157px"}
    htmlHeight={enlarge ? "280px" : "220px"}
  />
);

export default InfluenceCard;
