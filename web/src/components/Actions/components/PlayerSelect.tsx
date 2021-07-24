import { Text, List, ListItem, ListProps } from "@chakra-ui/react";
import * as React from "react";
import type { IPlayer } from "@contexts/GameStateContext";

interface IPlayerSelectProps extends ListProps {
  players: Array<IPlayer>;
  onSelection: (selectedPlayerId: string) => void;
}

const PlayerSelect: React.FC<IPlayerSelectProps> = ({ players, onSelection, ...props }) => (
  <List {...props}>
    {players.map((p) => (
      <ListItem
        key={p.id}
        onClick={() => p.coins > 0 ? onSelection(p.id) : null}
        aria-disabled={p.coins === 0}
        height={280 / players.length}
        alignItems="center"
        display="flex"
        placeContent="center"
        role="button"
        transition="background 500ms"
        _disabled={{
          color: "whiteAlpha.500",
          pointerEvents: "none"
        }}
        _hover={ p.coins > 0 ? {
          background: "rgba(66, 153, 225, 0.6)",
        } : {}}
        sx={{
          "&:first-of-type": {
            borderRadius: "10px 10px 0px 0px",
          },
          "&:last-of-type": {
            borderRadius: "0px 0px 10px 10px",
          },
          "&:not(:last-child)": {
            borderBottom: "1px solid",
            borderColor: "gray.800",
          },
        }}
      >
        <Text>{`${p.name} ${p.coins === 0 ? "(No coins to steal)" : ""}`}</Text>
      </ListItem>
    ))}
  </List>
);

export default PlayerSelect;
