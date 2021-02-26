import React from "react";
import {
    Button, Center, Divider, Input, Text
} from "@chakra-ui/react"

interface Player {
    name: string;
    id?: number;
}
let players: Player[] = [
    { name: 'Samara', id: 1 },
    { name: 'Kaleb', id: 2 },
];
// TODO: player list
// TODO: ability to change name
const PlayerList: React.FC = () => {

    return (
        <ul style={{ listStyle: 'none' }}>
            {
                players.map((player: Player) => <li>...</li>)
            }
        </ul>
    );
}
