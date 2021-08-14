import * as React from "react";
import { BoxProps, Button, Divider, Text, VStack } from "@chakra-ui/react";
import type { IPlayer, IPlayerInfluence } from "@contexts/GameStateContext";
import InfluenceCard from "@components/InfluenceCard";
import BaseModal from "./BaseModal";
import { useDeck } from "@contexts/DeckContext";
import { CardSet, CardSetHeader, CardSetInfluences } from "@components/CardSet";

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
    width: "100%",
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
        <CardSet width="100%">
          <CardSetHeader primaryText="Deck" secondaryText="Cards to go back in the deck" />
          <CardSetInfluences>
            {deckCards
              .map((exchangeInfluence) => (
                <InfluenceCard
                  button
                  containerProps={{
                    "aria-selected": exchangeInfluence.key === selectedDeckCard?.key,
                    onClick: () => setSelectedDeckCard((prevSelectedDeckCard) => (
                      prevSelectedDeckCard?.key === exchangeInfluence.key ? null : exchangeInfluence
                    )),
                    ...commonInfluenceCardContainerProps,
                  }}
                  key={exchangeInfluence.key}
                  influence={exchangeInfluence.type}
                  faceUp
                  disableAnimation
                />
              ))}
          </CardSetInfluences>
        </CardSet>
        <CardSet width="100%">
          <CardSetHeader primaryText="Your Hand" secondaryText="Cards you'll keep" />
          <CardSetInfluences>
            {playerCards
              .map((exchangeInfluence) => (
                <InfluenceCard
                  button={!exchangeInfluence.isDead}
                  containerProps={{
                    "aria-selected": exchangeInfluence.key === selectedPlayerCard?.key,
                    onClick: !exchangeInfluence.isDead ? () => setSelectedPlayerCard((prevSelectedPlayerCard) => (
                      prevSelectedPlayerCard?.key === exchangeInfluence.key ? null : exchangeInfluence
                    )) : undefined,
                    ...commonInfluenceCardContainerProps,
                  }}
                  key={exchangeInfluence.key}
                  isDead={exchangeInfluence.isDead}
                  influence={exchangeInfluence.type}
                  faceUp
                  disableAnimation
                />
              ))}
          </CardSetInfluences>
        </CardSet>
        <Divider />
        <Button onClick={() => handleDone()} width="full" height="12">
          Done
        </Button>
      </VStack>
    </BaseModal>
  );
};

export default ExchangeModal;
