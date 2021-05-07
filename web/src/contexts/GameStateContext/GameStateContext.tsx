import * as React from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import useCurrentGameState from "@GameState/useCurrentGameState";
import {
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

const GameStateContext = React.createContext<IGameStateContext | undefined>(undefined);
GameStateContext.displayName = "GameStateContext";

export const GameStateContextProvider: React.FC = ({ children }) => {
  const { players, setPlayers, getPlayerById } = usePlayers();
  const { deck, setDeck } = useDeck();
  const [currentGameState, sendGameStateEvent] = useCurrentGameState();
  const { roomCode } = useParams<{ roomCode: string }>();

  const socket = React.useMemo(
    () =>
      io("/", {
        auth: {
          roomCode,
          playerName: localStorage.getItem("playerName"),
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

  function handleActionResponse(response: "PASS" | "CHALLENGE" | "BLOCK") {
    socket.emit(OutgoingSocketActions.ProposeActionResponse, response);
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
    socket.off(IncomingSocketActions.PlayersChanged);
    socket.on(IncomingSocketActions.PlayersChanged, (playersInRoom: Array<Pick<IPlayer, "id" | "name">>) => {
      // only update player list if someone left once the game has started
      if (currentGameState.context.gameStarted && playersInRoom.length < players.length) {
        setPlayers((prevplayers) => prevplayers.filter((player) => playersInRoom.find((p) => p.id === player.id)));
      }
    });
  }, [currentGameState.context.gameStarted]);

  React.useEffect(() => {
    socket.off(IncomingSocketActions.UpdatePlayerActionResponse);
    socket.on(
      IncomingSocketActions.UpdatePlayerActionResponse,
      (actionResponse: { playerId: string; response: "PASS" | "CHALLENGE" | "BLOCK" }) => {
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
      },
    );

    if (players.every((p) => p.actionResponse === "PASS")) {
      sendGameStateEvent("PASS");
    } else if (players.some((p) => p.actionResponse === "CHALLENGE")) {
      sendGameStateEvent("CHALLENGE", {
        // we know it exists because of the 'some' above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        challengerId: players.find((p) => p.actionResponse === "CHALLENGE")!.id,
      });
    } else if (players.some((p) => p.actionResponse === "BLOCK")) {
      sendGameStateEvent("BLOCK", {
        // we know it exists because of the 'some' above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        blockerId: players.find((p) => p.actionResponse === "BLOCK")!.id,
      });
    }
  }, [players]);

  // put socket listeners in useEffect so it only registers on render
  React.useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on(IncomingSocketActions.PlayersChanged, (playersInRoom: Array<Pick<IPlayer, "id" | "name">>) => {
      setPlayers(
        playersInRoom.map((player) => ({
          id: player.id,
          coins: 2,
          influences: [],
          name: player.name,
          actionResponse: null,
        })),
      );
    });

    socket.on(IncomingSocketActions.GameStateUpdate, handleGameStateUpdate);

    socket.on(IncomingSocketActions.StartingDeck, (startinDeck: Array<Influence>) => {
      setDeck(startinDeck);
    });

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

export function useGameState(): IGameStateContext {
  const gameState = React.useContext(GameStateContext);
  if (!gameState) throw Error("Tried to use game state hook outside of a GameStateProvider.");
  else return gameState;
}
