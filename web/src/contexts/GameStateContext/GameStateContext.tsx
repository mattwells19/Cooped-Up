import * as React from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { getPlayerById } from "@utils/GameState/helperFns";
import useCurrentGameState from "@utils/GameState/useCurrentGameState";
import type { IGameState, IGameStateContext, Influence, IPlayer } from "./types";

export const GameStateContext = React.createContext<IGameStateContext | undefined>(undefined);
GameStateContext.displayName = "GameStateContext";

const GameStateContextProvider: React.FC = ({ children }) => {
	const [players, setPlayers] = React.useState<Array<IPlayer>>([]);
	const [deck, setDeck] = React.useState<Array<Influence>>([]);
	const [currentGameState, sendGameStateEvent] = useCurrentGameState([players, setPlayers], [deck, setDeck]);
	const { roomCode } = useParams<{ roomCode: string }>();

	const socket = React.useMemo(() => (
		io("/", {
			auth: {
				roomCode,
				playerName: localStorage.getItem("playerName"),
			},
			autoConnect: false,
			reconnectionAttempts: 5,
		})
	), [roomCode]);

	function handleGameStateUpdate(newGameState: IGameState) {
		sendGameStateEvent(newGameState.event, newGameState.eventPayload);
		if (newGameState.players) setPlayers(newGameState.players);
		if (newGameState.deck) setDeck(newGameState.deck);
	}

	function handleGameEvent(newGameState: IGameState) {
		socket.emit("updateGameState", newGameState);
	}

	function handleActionResponse(response: "PASS" | "CHALLENGE") {
		socket.emit("proposeActionResponse", response);
	}

	const handleStartGame = () => {
		const newDeck = [...deck];

		const playerHands: Array<IPlayer> = players.map((player) => ({
			...player,
			influences: newDeck.splice(0, 2).map((influence) => ({ type: influence, isDead: false })),
		}));

		handleGameEvent({
			event: "START",
			eventPayload: { playerTurnId: playerHands[0].id },
			players: playerHands,
			deck: newDeck,
		});
	};

	React.useEffect(() => {
		socket.off("players_changed");
		socket.on("players_changed", (playersInRoom: Array<Pick<IPlayer, "id" | "name">>) => {
			// only update player list if someone left once the game has started
			if (currentGameState.context.gameStarted && playersInRoom.length < players.length) {
				setPlayers((prevplayers) => (
					prevplayers.filter((player) => playersInRoom.find((p) => p.id === player.id))
				));
			}
		});
	}, [currentGameState.context.gameStarted]);

	React.useEffect(() => {
		socket.off("updatePlayerActionResponse");
		socket.on("updatePlayerActionResponse", (actionResponse: { playerId: string, response: "PASS" | "CHALLENGE" }) => {
			setPlayers((prevPlayers) => {
				const playerToUpdate = getPlayerById(prevPlayers, actionResponse.playerId).index;
				if (playerToUpdate === -1) throw new Error(`No player with id ${actionResponse.playerId}`);
				const newPlayers = [...prevPlayers];
				newPlayers[playerToUpdate] = {
					...newPlayers[playerToUpdate],
					actionResponse: actionResponse.response,
				};
				return newPlayers;
			});
		});

		if (players.every((p) => p.actionResponse === "PASS")) {
			sendGameStateEvent("PASS");
		} else if (players.some((p) => p.actionResponse === "CHALLENGE")) {
			sendGameStateEvent("CHALLENGE", {
				// we know it exists because of the 'some' above
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				challengerId: players.find((p) => p.actionResponse === "CHALLENGE")!.id,
			});
		}
	}, [players]);

	// put socket listeners in useEffect so it only registers on render
	React.useEffect(() => {
		if (!socket.connected) socket.connect();

		socket.on("players_changed", (playersInRoom: Array<Pick<IPlayer, "id" | "name">>) => {
			setPlayers(playersInRoom.map((player) => ({
				id: player.id,
				coins: 2,
				influences: [],
				name: player.name,
				actionResponse: null,
			})));
		});

		socket.on("gameStateUpdate", handleGameStateUpdate);

		socket.on("startingDeck", (startinDeck: Array<Influence>) => { setDeck(startinDeck); });

		// perform cleanup of socket when component is removed from the DOM
		return () => { socket.offAny(); socket.disconnect(); };
	}, []);

	return (
		<GameStateContext.Provider
			value={{
				currentPlayerId: socket.id,
				players,
				turn: currentGameState.context.playerTurnId,
				handleGameEvent,
				handleStartGame,
				handleActionResponse,
				...currentGameState.context,
			}}
		>
			{children}
		</GameStateContext.Provider>
	);
};

function useGameState(): IGameStateContext {
	const gameState = React.useContext(GameStateContext);
	if (!gameState) throw Error("Tried to use game state hook outside of a GameStateProvider.");
	else return gameState;
}

export { GameStateContextProvider as default, useGameState };
