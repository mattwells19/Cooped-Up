import { Text, List, ListItem, ListProps } from "@chakra-ui/react";
import * as React from "react";
import type { IPlayer } from "@contexts/GameStateContext";

interface IPlayerSelectProps extends ListProps {
  players: Array<IPlayer>;
  isPlayerSelectable: (player: IPlayer) => boolean;
  onSelection: (selectedPlayerId: string) => void;
}

const PlayerSelect: React.FC<IPlayerSelectProps> = ({ players, isPlayerSelectable, onSelection, ...props }) => (
  <List {...props}>
    {players.map((p) => {
      const playerIsSelectable = isPlayerSelectable(p);

      return (
        <ListItem
          key={p.id}
          onClick={() => playerIsSelectable ? onSelection(p.id) : null}
          aria-disabled={!playerIsSelectable}
          height={[112, 270].map((num) => `${Math.round(num / players.length)}px`)}
          alignItems="center"
          display="flex"
          placeContent="center"
          role="button"
          transition="background 500ms"
          _disabled={{
            color: "whiteAlpha.500",
            pointerEvents: "none"
          }}
          _hover={ playerIsSelectable ? {
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
          <Text>{p.name}</Text>
        </ListItem>
      );
    })}
  </List>
);

export default PlayerSelect;
