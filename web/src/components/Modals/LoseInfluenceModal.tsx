import * as React from "react";
import { Center, HStack, Text, useId, VStack } from "@chakra-ui/react";
import type { Influence, IPlayer } from "@contexts/GameStateContext/types";
import InfluenceCard from "../InfluenceCard";
import BaseModal from "./BaseModal";

interface ILoseInfluenceModal {
  handleClose: (killInfluence: Influence) => void;
  currentPlayer: IPlayer;
}

const LoseInfluenceModal: React.FC<ILoseInfluenceModal> = ({ currentPlayer, handleClose }) => (
	<BaseModal>
		<VStack spacing="4" margin="10">
			<Text fontSize="large" textAlign="center">
        Select an influence to lose.
			</Text>
			<Center>
				<HStack spacing="10px">
					{currentPlayer.influences.filter((i) => !i.isDead).map((influence, index) => (
						<InfluenceCard
							key={`${influence.type}-${useId()}`}
							enlarge
							faceUp
							influence={influence.type}
							onClick={() => handleClose(influence.type)}
							_hover={{
								transform: `scale(1.1) translateX(${index === 0 ? "-10px" : "10px"})`,
							}}
							transition="transform 500ms"
							role="button"
						/>
					))}
				</HStack>
			</Center>
		</VStack>
	</BaseModal>
);

export default LoseInfluenceModal;
