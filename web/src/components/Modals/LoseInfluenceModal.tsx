import * as React from "react";
import { Divider, useId } from "@chakra-ui/react";
import type { Influence, IPlayer } from "@contexts/GameStateContext/types";
import InfluenceCard from "../InfluenceCard/InfluenceCard";
import BaseModal from "./BaseModal";
import { CardSet, CardSetHeader, CardSetInfluences } from "@components/CardSet";

interface ILoseInfluenceModal {
  handleClose: (killInfluence: Influence) => void;
  currentPlayer: IPlayer;
}

const LoseInfluenceModal: React.FC<ILoseInfluenceModal> = ({ currentPlayer, handleClose }) => {
  return (
    <BaseModal>
      <CardSet gridGap="4" margin={["5", "10"]}>
        <CardSetHeader primaryText="Select an influence to lose." />
        <Divider />
        <CardSetInfluences>
          {currentPlayer.influences
            .filter((i) => !i.isDead)
            .map((influence) => {
              return (
                <InfluenceCard
                  button
                  key={`${influence.type}-${useId()}`}
                  faceUp
                  influence={influence.type}
                  onClick={() => handleClose(influence.type)}
                />
              );
            })}
        </CardSetInfluences>
      </CardSet>
    </BaseModal>
  );
};

export default LoseInfluenceModal;
