import * as React from "react";
import { Image, ImageProps } from "@chakra-ui/react";
import type { Influence } from "@contexts/GameStateContext/types";
import { InfluenceDetails } from "@utils/InfluenceUtils";
import { BlankImg } from "@images/InfluenceImages";

interface IInfluenceCardProps extends ImageProps {
  faceUp: boolean;
  enlarge?: boolean;
  influence: Influence;
  onClick?: () => void;
}

const InfluenceCard: React.FC<IInfluenceCardProps> = ({ influence, enlarge = false, faceUp, onClick, ...props }) => (
	<Image
		alt={faceUp ? influence.toString() : "Hidden Influence"}
		src={faceUp ? InfluenceDetails[influence].img : BlankImg}
		htmlWidth={enlarge ? "200px" : "157px"}
		htmlHeight={enlarge ? "280px" : "220px"}
		onClick={onClick}
		{...props}
	/>
);

export default InfluenceCard;
