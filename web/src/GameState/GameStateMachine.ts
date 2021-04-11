import { assign, createMachine } from "xstate";
import type { Actions, Influence } from "@contexts/GameStateContext";

export interface IGameStateMachineContext {
  playerTurnId: string;
  action: Actions | null;
  performerId: string;
  gameStarted: boolean;
  victimId: string;
  killedInfluence: Influence | undefined;
  challengeFailed: boolean | undefined;
  challengerId: string | undefined;
}

export type GameStateMachineEvent =
  | { type: "ACTION"; action: Actions; performerId: string; victimId: string }
  | { type: "BLOCK" }
  | { type: "CHALLENGE"; challengerId: string }
  | { type: "COMPLETE"; nextPlayerTurnId: string }
  | { type: "FAILED" }
  | { type: "PASS"; killedInfluence: Influence | undefined }
  | { type: "LOSE_INFLUENCE"; killedInfluence: Influence; challengeFailed: boolean }
  | { type: "START"; playerTurnId: string };

export type GameStateMachineState =
  | { value: "pregame"; context: IGameStateMachineContext }
  | { value: "idle"; context: IGameStateMachineContext }
  | { value: "propose_action"; context: IGameStateMachineContext }
  | { value: "perform_action"; context: IGameStateMachineContext }
  | { value: "blocked"; context: IGameStateMachineContext }
  | { value: "challenged"; context: IGameStateMachineContext };

const GameStateMachine = createMachine<IGameStateMachineContext, GameStateMachineEvent, GameStateMachineState>({
  id: "gameState",
  initial: "pregame",
  context: {
    playerTurnId: "",
    action: null,
    gameStarted: false,
    performerId: "",
    victimId: "",
    killedInfluence: undefined,
    challengeFailed: undefined,
    challengerId: undefined,
  },
  states: {
    pregame: {
      on: {
        START: {
          target: "idle",
          actions: assign((_, event) => ({
            playerTurnId: event.playerTurnId,
            gameStarted: true,
          })),
        },
      },
    },
    idle: {
      entry: assign((context) => ({
        ...context,
        action: null,
        performerId: "",
        victimId: "",
        killedInfluence: undefined,
        challengeFailed: undefined,
        challengerId: undefined,
      })),
      on: {
        ACTION: {
          target: "propose_action",
          actions: assign((_, event) => ({
            action: event.action,
            performerId: event.performerId,
            victimId: event.victimId,
          })),
        },
      },
    },
    propose_action: {
      on: {
        BLOCK: "blocked",
        CHALLENGE: {
          target: "challenged",
          actions: assign({
            challengerId: (_, event) => event.challengerId,
          }),
        },
        PASS: {
          target: "perform_action",
          actions: assign({
            killedInfluence: (_, event) => event.killedInfluence,
          }),
        },
      },
    },
    perform_action: {
      on: {
        COMPLETE: {
          target: "idle",
          actions: assign({
            playerTurnId: (_, event) => event.nextPlayerTurnId,
          }),
        },
      },
    },
    blocked: {
      on: {
        COMPLETE: "idle",
        CHALLENGE: "challenged",
      },
    },
    challenged: {
      on: {
        FAILED: "perform_action",
        COMPLETE: {
          target: "idle",
          actions: assign({
            playerTurnId: (_, event) => event.nextPlayerTurnId,
          }),
        },
        LOSE_INFLUENCE: {
          actions: assign((_, event) => ({
            killedInfluence: event.killedInfluence,
            challengeFailed: event.challengeFailed,
          })),
        },
      },
    },
  },
});

export default GameStateMachine;
