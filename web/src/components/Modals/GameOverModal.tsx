import * as React from "react";
import { Text, VStack, Image, Button, ButtonGroup } from "@chakra-ui/react";
import type { IPlayer } from "@contexts/GameStateContext/types";
import BaseModal from "./BaseModal";
import WinnerPenguin from "@images/WinnerPenguin.gif";
import SadPenguin from "@images/SadPenguin.gif";
import { Link } from "react-router-dom";

interface IGameOverModal {
  winner: IPlayer;
  currentPlayer: IPlayer;
  onPlayAgain: () => void;
}

const GameOverModal: React.FC<IGameOverModal> = ({ currentPlayer, winner, onPlayAgain }) => (
  <BaseModal>
    <VStack spacing="4" margin="10" marginTop="5">
      <Text fontFamily="Nova Flat" fontSize="5xl" textAlign="center">
        {currentPlayer.id === winner.id ? "Congratulations!" : `${winner.name} has won.`}
      </Text>
      <Text fontSize="2xl" textAlign="center">
        {currentPlayer.id === winner.id ? "🎉 You've won! 🎉" : "😞 Better luck next time. 😞"}
      </Text>
      <Image src={currentPlayer.id === winner.id ? WinnerPenguin : SadPenguin} />
      <ButtonGroup paddingTop="5">
        <Button onClick={() => onPlayAgain()} width="36">Play Again</Button>
        <Button as={Link} to="/" variant="outline" width="36">Go Home</Button>
      </ButtonGroup>
    </VStack>
  </BaseModal>
);

export default GameOverModal;
