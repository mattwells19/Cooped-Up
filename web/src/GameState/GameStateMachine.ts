import { assign, createMachine } from "xstate";
import type { Actions, Influence } from "@contexts/GameStateContext";
import type { IGameStateExchangeDetails } from "./types";

export interface IGameStateMachineContextPlayerIds {
  blockerId: string;
  challengerId: string;
  playerTurnId: string;
  performerId: string;
  victimId: string;
  winningPlayerId: string;
}

export interface IGameStateMachineContextMetadata {
  action: Actions | null;
  gameStarted: boolean;
  killedInfluence: Influence | "NO_INFLUENCES_LEFT" | undefined;
  blockingInfluence: Influence | undefined;
  challengeFailed: boolean | undefined;
  blockSuccessful: boolean | undefined;
  exchangeDetails: IGameStateExchangeDetails | undefined;
}

export type IGameStateMachineContext = IGameStateMachineContextPlayerIds & IGameStateMachineContextMetadata;

export type GameStateMachineEvent =
  | { type: "ACTION"; action: Actions; performerId: string; victimId: string }
  | { type: "BLOCK"; blockerId: string; blockingInfluence: Influence }
  | { type: "CHALLENGE"; challengerId: string }
  | { type: "CHALLENGE_BLOCK_FAILED"; nextPlayerTurnId: string }
  | { type: "COMPLETE"; nextPlayerTurnId: string }
  | { type: "END_GAME"; winningPlayerId: string }
  | { type: "FAILED" }
  | { type: "LOSE_INFLUENCE"; killedInfluence: Influence; challengeFailed: boolean }
  | {
      type: "PASS";
      killedInfluence: Influence | "NO_INFLUENCES_LEFT" | undefined;
      exchangeDetails: IGameStateExchangeDetails;
    }
  | { type: "PLAY_AGAIN" }
  | { type: "START"; playerTurnId: string };

export type GameStateMachineStateOptions =
  | "blocked"
  | "challenged"
  | "challenge_block"
  | "game_over"
  | "idle"
  | "pregame"
  | "perform_action"
  | "propose_action";

export type GameStateMachineState = { value: GameStateMachineStateOptions; context: IGameStateMachineContext };

const GameStateMachine = createMachine<IGameStateMachineContext, GameStateMachineEvent, GameStateMachineState>({
  context: {
    action: null,
    blockSuccessful: undefined,
    blockerId: "",
    blockingInfluence: undefined,
    challengeFailed: undefined,
    challengerId: "",
    exchangeDetails: undefined,
    gameStarted: false,
    killedInfluence: undefined,
    performerId: "",
    playerTurnId: "",
    victimId: "",
    winningPlayerId: "",
  },
  id: "gameState",
  initial: "pregame",
  states: {
    blocked: {
      on: {
        CHALLENGE: {
          actions: assign({
            challengerId: (_, event) => event.challengerId,
          }),
          target: "challenge_block",
        },
        COMPLETE: {
          actions: assign({
            playerTurnId: (_, event) => event.nextPlayerTurnId,
          }),
          target: "idle",
        },
        PASS: {
          actions: assign((context) => ({
            ...context,
            blockSuccessful: true,
          })),
        },
      },
    },
    challenge_block: {
      on: {
        CHALLENGE_BLOCK_FAILED: {
          actions: assign({
            playerTurnId: (_, event) => event.nextPlayerTurnId,
          }),
          target: "idle",
        },
        COMPLETE: {
          actions: assign((context) => ({
            ...context,
            blockSuccessful: undefined,
            blockerId: "",
            blockingInfluence: undefined,
            challengeFailed: undefined,
            challengerId: "",
            killedInfluence: undefined,
          })),
          target: "perform_action",
        },
        LOSE_INFLUENCE: {
          actions: assign((_, event) => ({
            challengeFailed: event.challengeFailed,
            killedInfluence: event.killedInfluence,
          })),
        },
      },
    },
    challenged: {
      on: {
        COMPLETE: {
          actions: assign({
            playerTurnId: (_, event) => event.nextPlayerTurnId,
          }),
          target: "idle",
        },
        FAILED: {
          actions: assign((context) => ({
            ...context,
            challengeFailed: undefined,
            challengerId: "",
            killedInfluence: undefined,
          })),
          target: "perform_action",
        },
        LOSE_INFLUENCE: {
          actions: assign((_, event) => ({
            challengeFailed: event.challengeFailed,
            killedInfluence: event.killedInfluence,
          })),
        },
      },
    },
    game_over: {
      on: {
        PLAY_AGAIN: {
          actions: assign((context) => ({
            ...context,
            action: null,
            blockSuccessful: undefined,
            blockerId: "",
            blockingInfluence: undefined,
            challengeFailed: undefined,
            challengerId: "",
            gameStarted: false,
            killedInfluence: undefined,
            performerId: "",
            playerTurnId: "",
            victimId: "",
            winningPlayerId: "",
          })),
          target: "pregame",
        },
      },
    },
    idle: {
      entry: assign((context) => ({
        ...context,
        action: null,
        blockSuccessful: undefined,
        blockerId: "",
        blockingInfluence: undefined,
        challengeFailed: undefined,
        challengerId: "",
        exchangeDetails: undefined,
        killedInfluence: undefined,
        performerId: "",
        victimId: "",
      })),
      on: {
        ACTION: {
          actions: assign((_, event) => ({
            action: event.action,
            performerId: event.performerId,
            victimId: event.victimId,
          })),
          target: "propose_action",
        },
        COMPLETE: {
          actions: assign({
            playerTurnId: (_, event) => event.nextPlayerTurnId,
          }),
        },
        END_GAME: {
          actions: assign({
            winningPlayerId: (_, event) => event.winningPlayerId,
          }),
          target: "game_over",
        },
      },
    },
    perform_action: {
      on: {
        COMPLETE: {
          actions: assign({
            playerTurnId: (_, event) => event.nextPlayerTurnId,
          }),
          target: "idle",
        },
        PASS: {
          actions: assign((_, event) => ({
            exchangeDetails: event.exchangeDetails,
            killedInfluence: event.killedInfluence,
          })),
        },
      },
    },
    pregame: {
      on: {
        START: {
          actions: assign((_, event) => ({
            gameStarted: true,
            playerTurnId: event.playerTurnId,
          })),
          target: "idle",
        },
      },
    },
    propose_action: {
      on: {
        BLOCK: {
          actions: assign({
            blockerId: (_, event) => event.blockerId,
            blockingInfluence: (_, event) => event.blockingInfluence,
          }),
          target: "blocked",
        },
        CHALLENGE: {
          actions: assign({
            challengerId: (_, event) => event.challengerId,
          }),
          target: "challenged",
        },
        PASS: "perform_action",
      },
    },
  },
});

export default GameStateMachine;
