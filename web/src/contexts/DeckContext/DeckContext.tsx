import * as React from "react";
import type { Influence } from "@contexts/GameStateContext";
import type { IDeckContext } from "./types";

const DeckContext = React.createContext<IDeckContext | undefined>(undefined);
DeckContext.displayName = "DeckContext";

export const DeckContextProvider: React.FC = ({ children }) => {
  const [deck, setDeck] = React.useState<Array<Influence>>([]);

  return (
    <DeckContext.Provider
      value={{
        deck,
        setDeck,
      }}
    >
      {children}
    </DeckContext.Provider>
  );
};

export function useDeck(): IDeckContext {
  const deckContext = React.useContext(DeckContext);
  if (!deckContext) throw new Error("You cannot consume deck context outside of a deck context provider.");
  else return deckContext;
}