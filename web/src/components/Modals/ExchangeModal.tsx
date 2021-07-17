import * as React from "react";
import { BoxProps, Button, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import type { IPlayer, IPlayerInfluence } from "@contexts/GameStateContext/types";
import InfluenceCard from "../InfluenceCard";
import BaseModal from "./BaseModal";
import { useDeck } from "@contexts/DeckContext";

interface IExchangeModal {
  handleClose: (playerHand: Array<IPlayerInfluence>, deck: Array<IPlayerInfluence>) => void;
  currentPlayer: IPlayer;
}

interface IExchangeCard extends IPlayerInfluence {
  key: string;
}

const ExchangeModal: React.FC<IExchangeModal> = ({ currentPlayer, handleClose }) => {
  const { deck } = useDeck();

  const [deckCards, setDeckCards] = React.useState<Array<IExchangeCard>>(
    deck.slice(0, 2).map((influence) => ({ isDead: false, key: `${influence}-${Math.random()}`, type: influence }))
  );
  const [playerCards, setPlayerCards] = React.useState<Array<IExchangeCard>>(
    currentPlayer.influences.map(
      (playerInfluence) => ({ ...playerInfluence, key: `${playerInfluence.type}-${Math.random()}` })
    )
  );
 
  const [selectedDeckCard, setSelectedDeckCard] = React.useState<IExchangeCard | null>();
  const [selectedPlayerCard, setSelectedPlayerCard] = React.useState<IExchangeCard | null>();

  React.useEffect(() => {
    if (selectedDeckCard && selectedPlayerCard) {
      setPlayerCards((prevPlayerCards) => (
        prevPlayerCards.map((prevPlayerCard) => {
          if (prevPlayerCard.key === selectedPlayerCard.key) {
            return selectedDeckCard;
          } else {
            return prevPlayerCard;
          }
        })
      ));
      setDeckCards((prevDeckCards) => (
        prevDeckCards.map((prevDeckCard) => {
          if (prevDeckCard.key === selectedDeckCard.key) {
            return selectedPlayerCard;
          } else {
            return prevDeckCard;
          }
        })
      ));
      setSelectedDeckCard(null);
      setSelectedPlayerCard(null);
    }
  }, [selectedDeckCard, selectedPlayerCard]);

  function handleDone() {
    const newPlayersHand: Array<IPlayerInfluence> = playerCards.map(
      (playerCard) => ({ isDead: playerCard.isDead, type: playerCard.type })
    );
    const newDeckCards: Array<IPlayerInfluence> = deckCards.map(
      (deckCard) => ({ isDead: false, type: deckCard.type })
    );
    handleClose(newPlayersHand, newDeckCards);
  }

  const commonInfluenceCardContainerProps: BoxProps = {
    _selected: {
      borderColor: "teal.200",
    },
    border: "4px solid transparent",
    borderRadius: "8px",
    padding: "1",
    transition: "transform 500ms",
  };

  return (
    <BaseModal>
      <VStack spacing="4" margin="5">
        <Text fontSize="large" textAlign="center">
          Select one card from the deck and one from your hand to swap.
        </Text>
        <Text fontSize="large" textAlign="center">
          Once you are happy with your hand, click <Text as="span" fontWeight="bold">Done</Text>.
        </Text>
        <Divider />
        <VStack>
          <HStack justifyContent="space-between" width="full">
            <Text flex="1">Deck</Text>
            <Text textAlign="right" color="gray.400">Cards to go back in the deck.</Text>
          </HStack>
          <HStack spacing="10px">
            {deckCards
              .map((exchangeInfluence, index) => (
                <InfluenceCard
                  containerProps={{
                    _hover: {
                      transform: `scale(1.05) translateX(${index === 0 ? "-5px" : "5px"})`,
                    },
                    "aria-selected": exchangeInfluence.key === selectedDeckCard?.key,
                    onClick: () => setSelectedDeckCard((prevSelectedDeckCard) => (
                      prevSelectedDeckCard?.key === exchangeInfluence.key ? null : exchangeInfluence
                    )),
                    role: "button",
                    ...commonInfluenceCardContainerProps,
                  }}
                  key={exchangeInfluence.key}
                  influence={exchangeInfluence.type}
                  enlarge
                  faceUp
                  disableAnimation
                />
              ))}
          </HStack>
        </VStack>
        <VStack>
          <HStack justifyContent="space-between" width="full">
            <Text flex="1">Your Hand</Text>
            <Text textAlign="right" color="gray.400">Cards you&apos;ll keep.</Text>
          </HStack>
          <HStack spacing="10px">
            {playerCards
              .map((exchangeInfluence, index) => (
                <InfluenceCard
                  containerProps={{
                    _hover: exchangeInfluence.isDead ? {} : {
                      transform: `scale(1.05) translateX(${index === 0 ? "-5px" : "5px"})`,
                    },
                    "aria-selected": exchangeInfluence.key === selectedPlayerCard?.key,
                    onClick: !exchangeInfluence.isDead ? () => setSelectedPlayerCard((prevSelectedPlayerCard) => (
                      prevSelectedPlayerCard?.key === exchangeInfluence.key ? null : exchangeInfluence
                    )) : undefined,
                    role: exchangeInfluence.isDead ? "" : "button",
                    ...commonInfluenceCardContainerProps,
                  }}
                  key={exchangeInfluence.key}
                  isDead={exchangeInfluence.isDead}
                  influence={exchangeInfluence.type}
                  enlarge
                  faceUp
                  disableAnimation
                />
              ))}
          </HStack>
        </VStack>
        <Divider />
        <Button onClick={() => handleDone()} width="full" height="12">
          Done
        </Button>
      </VStack>
    </BaseModal>
  );
};

export default ExchangeModal;
