import * as React from "react";
import { Text, Table, Th, Thead, Tr, Td, Tbody, Checkbox } from "@chakra-ui/react";
import { useGameState } from "../contexts/GameStateContext/GameStateContext";

interface IGameProps {}

const Game: React.FC<IGameProps> = () => {
  const { players, turn } = useGameState();

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Is Turn</Th>
          <Th>Name</Th>
          <Th isNumeric>Coins</Th>
          <Th>Influences</Th>
        </Tr>
      </Thead>
      <Tbody>
        {players.map((player) => (
          <Tr key={player.name}>
            <Td><Checkbox isChecked={turn.localeCompare(player.name) === 0} isReadOnly /></Td>
            <Td>{player.name}</Td>
            <Td isNumeric>{player.coins}</Td>
            <Td>
              {player.influences.map((influence) => (
                <Text key={`${player.name}-${influence.type}-${Math.random()}`}>{influence.type}</Text>
              ))}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default Game;
