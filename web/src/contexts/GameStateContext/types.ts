type Influence = "Duke" | "Captain" | "Ambassador" | "Contessa" | "Assassin" | "Inquisitor";

interface IGameState {
  gameStarted: boolean;
  players: Array<IPlayer>;
  turn: string;
}

interface IPlayerInfluence {
  type: Influence;
  isDead: boolean;
}

interface IPlayer {
  name: string;
  coins: number;
  influences: Array<IPlayerInfluence>;
}

interface IGameStateContext {
  currentPlayerName: string;
  gameStarted: boolean;
  players: Array<IPlayer>;
  turn: string;
  handleGameEvent: (newGameState: IGameState) => void;
  handleGameStateUpdate: (newGameState: IGameState) => void;
  handleStartGame: () => void;
}

export { Influence, IGameState, IPlayerInfluence, IPlayer, IGameStateContext };
