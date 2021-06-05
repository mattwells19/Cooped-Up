import * as React from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import useCurrentGameState from "@GameState/useCurrentGameState";
import {
  IActionResponse,
  IGameState,
  IGameStateContext,
  IncomingSocketActions,
  Influence,
  IPlayer,
  OutgoingSocketActions,
} from "./types";
import { usePlayers } from "@contexts/PlayersContext";
import { useDeck } from "@contexts/DeckContext";
import PlayerNotFoundError from "@utils/PlayerNotFoundError";
import get from "@utils/get";

const GameStateContext = React.createContext<IGameStateContext | undefined>(undefined);
GameStateContext.displayName = "GameStateContext";

export const GameStateContextProvider: React.FC = ({ children }) => {
  const { players, setPlayers, getPlayerById } = usePlayers();
  const { setDeck } = useDeck();
  const [currentGameState, sendGameStateEvent] = useCurrentGameState();
  const { roomCode } = useParams<{ roomCode: string }>();

  const socket = React.useMemo(
    () =>
      io("/", {
        auth: {
          playerName: localStorage.getItem("playerName"),
          roomCode,
        },
        autoConnect: false,
        reconnectionAttempts: 5,
      }),
    [roomCode],
  );

  function handleGameStateUpdate(newGameState: IGameState) {
    sendGameStateEvent(newGameState.event, newGameState.eventPayload);
    if (newGameState.players) setPlayers(newGameState.players);
    if (newGameState.deck) setDeck(newGameState.deck);
  }

  function handleGameEvent(newGameState: IGameState) {
    socket.emit(OutgoingSocketActions.UpdateGameState, newGameState);
  }

  function handleActionResponse(response: IActionResponse) {
    socket.emit(OutgoingSocketActions.ProposeActionResponse, response);
  }

  const handleStartGame = async () => {
    const deck = await get<Array<Influence>>(`deck?roomCode=${roomCode}`);

    const playerHands: Array<IPlayer> = players.map((player) => ({
      ...player,
      actionResponse: null,
      coins: 2,
      influences: deck.splice(0, 2).map((influence) => ({ isDead: false, type: influence })),
    }));

    handleGameEvent({
      deck,
      event: "START",
      eventPayload: { playerTurnId: playerHands[0].id },
      players: playerHands,
    });
  };

  React.useEffect(() => {
    socket.off(IncomingSocketActions.PlayersChanged);
    socket.on(IncomingSocketActions.PlayersChanged, (playersInRoom: Array<Pick<IPlayer, "id" | "name">>) => {
      // only update player list if someone left once the game has started
      if (currentGameState.context.gameStarted) {
        if (playersInRoom.length < players.length) {
          setPlayers((prevplayers) => prevplayers.filter((player) => playersInRoom.find((p) => p.id === player.id)));
        }
      } else {
        setPlayers(
          playersInRoom.map((player) => ({
            actionResponse: null,
            coins: 2,
            id: player.id,
            influences: [],
            name: player.name,
          })),
        );
      }
    });
  }, [currentGameState.context.gameStarted]);

  React.useEffect(() => {
    socket.off(IncomingSocketActions.UpdatePlayerActionResponse);
    socket.on(
      IncomingSocketActions.UpdatePlayerActionResponse,
      (actionResponse: { playerId: string; response: IActionResponse }) => {
        setPlayers((prevPlayers) => {
          const playerToUpdate = getPlayerById(actionResponse.playerId);
          if (!playerToUpdate) throw new PlayerNotFoundError(actionResponse.playerId);

          const newPlayers = [...prevPlayers];
          newPlayers[playerToUpdate.index] = {
            ...newPlayers[playerToUpdate.index],
            actionResponse: actionResponse.response,
          };
          return newPlayers;
        });

        if (actionResponse.response.type === "CHALLENGE") {
          sendGameStateEvent("CHALLENGE", {
            challengerId: actionResponse.playerId,
          });
        } else if (actionResponse.response.type === "BLOCK") {
          sendGameStateEvent("BLOCK", {
            blockerId: actionResponse.playerId,
            blockingInfluence: actionResponse.response.influence,
          });
        }
      },
    );

    if (players.every((p) => p.actionResponse && p.actionResponse.type === "PASS")) {
      sendGameStateEvent("PASS");
    }
  }, [players]);

  // put socket listeners in useEffect so it only registers on render
  React.useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on(IncomingSocketActions.PlayersChanged, (playersInRoom: Array<Pick<IPlayer, "id" | "name">>) => {
      setPlayers(
        playersInRoom.map((player) => ({
          actionResponse: null,
          coins: 2,
          id: player.id,
          influences: [],
          name: player.name,
        })),
      );
    });

    socket.on(IncomingSocketActions.GameStateUpdate, handleGameStateUpdate);

    // perform cleanup of socket when component is removed from the DOM
    return () => {
      socket.offAny();
      socket.disconnect();
    };
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        currentPlayerId: socket.id,
        handleActionResponse,
        handleGameEvent,
        handleStartGame,
        turn: currentGameState.context.playerTurnId,
        ...currentGameState.context,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export function useGameState(): IGameStateContext {
  const gameState = React.useContext(GameStateContext);
  if (!gameState) throw Error("Tried to use game state hook outside of a GameStateProvider.");
  else return gameState;
}
