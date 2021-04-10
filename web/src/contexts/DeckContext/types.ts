import type { Influence } from "@contexts/GameStateContext";
import type { Dispatch, SetStateAction } from "react";

export interface IDeckContext {
	deck: Array<Influence>;
	setDeck: Dispatch<SetStateAction<Array<Influence>>>;
}
