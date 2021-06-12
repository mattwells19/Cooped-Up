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
import { Box, Spinner } from "@chakra-ui/react";

const GameStateContext = React.createContext<IGameStateContext | null | undefined>(undefined);
GameStateContext.displayName = "GameStateContext";

export const GameStateContextProvider: React.FC = ({ children }) => {
  const { players, setPlayers, getPlayerById } = usePlayers();
  const { setDeck } = useDeck();
  const [currentGameState, sendGameStateEvent, gameStateRoles] = useCurrentGameState();
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

  const currentPlayer = React.useMemo<IPlayer | undefined>(() => getPlayerById(socket.id), [socket.id, getPlayerById]);

  const handleGameStateUpdate = React.useCallback((newGameState: IGameState) => {
    sendGameStateEvent(newGameState.event, newGameState.eventPayload);
    if (newGameState.players) setPlayers(newGameState.players);
    if (newGameState.deck) setDeck(newGameState.deck);
  }, [sendGameStateEvent, setPlayers, setDeck]);

  const handleGameEvent = React.useCallback((newGameState: IGameState) => {
    socket.emit(OutgoingSocketActions.UpdateGameState, newGameState);
  }, [socket]);

  const handleActionResponse = React.useCallback((response: IActionResponse) => {
    socket.emit(OutgoingSocketActions.ProposeActionResponse, response);
  }, [socket]);

  const handleStartGame = React.useCallback(async () => {
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
  }, [players, handleGameEvent]);

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
          playersInRoom.map((player, index) => ({
            actionResponse: null,
            coins: 2,
            id: player.id,
            index,
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
        playersInRoom.map((player, index) => ({
          actionResponse: null,
          coins: 2,
          id: player.id,
          index,
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
      value={currentPlayer ? {
        action: currentGameState.context.action,
        blockSuccessful: currentGameState.context.blockSuccessful,
        blockingInfluence: currentGameState.context.blockingInfluence,
        challengeFailed: currentGameState.context.challengeFailed,
        currentPlayer,
        gameStarted: currentGameState.context.gameStarted,
        handleActionResponse,
        handleGameEvent,
        handleStartGame,
        killedInfluence: currentGameState.context.killedInfluence,
        ...gameStateRoles,
      } : null}
    >
      {currentPlayer ? children : (
        <Box display="grid" placeItems="center" width="full" height="100vh">
          <Spinner thickness="6px" size="xl" />
        </Box>
      )}
    </GameStateContext.Provider>
  );
};

export function useGameState(): IGameStateContext {
  const gameState = React.useContext(GameStateContext);
  if (!gameState) throw Error("Tried to use game state hook outside of a GameStateProvider.");
  else return gameState;
}
