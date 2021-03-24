import { assign, createMachine } from "xstate";
import type { Actions } from "../contexts/GameStateContext/types";

interface GameStateMachineContext {
  playerTurnId: string;
  action: Actions | null;
  performerId: string;
  gameStarted: boolean;
  victimId: string;
}

export type GameStateMachineEvent =
  | { type: "ACTION"; action: Actions; victimId: string }
  | { type: "BLOCK" }
  | { type: "CHALLENGE" }
  | { type: "COMPLETE"; nextPlayerTurnId: string }
  | { type: "FAILED" }
  | { type: "PASS" }
  | { type: "START"; playerTurnId: string };

export type GameStateMachineState =
  | { value: "pregame"; context: GameStateMachineContext }
  | { value: "idle"; context: GameStateMachineContext }
  | { value: "propose_action"; context: GameStateMachineContext }
  | { value: "perform_action"; context: GameStateMachineContext }
  | { value: "blocked"; context: GameStateMachineContext }
  | { value: "challenged"; context: GameStateMachineContext };

const GameStateMachine = createMachine<GameStateMachineContext, GameStateMachineEvent, GameStateMachineState>({
  id: "gameState",
  initial: "pregame",
  context: {
    playerTurnId: "",
    action: null,
    gameStarted: false,
    performerId: "",
    victimId: "",
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
      on: {
        ACTION: {
          target: "propose_action",
          actions: assign((_, event) => ({
            action: event.action,
            victimId: event.victimId,
          })),
        },
      },
    },
    propose_action: {
      on: {
        BLOCK: "blocked",
        CHALLENGE: "challenged",
        PASS: "perform_action",
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
        COMPLETE: "idle",
      },
    },
  },
});

export default GameStateMachine;
