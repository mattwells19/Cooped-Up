type Influence = "Duke" | "Captain" | "Ambassador" | "Contessa" | "Assassin";

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
  id: string;
  name: string;
  coins: number;
  influences: Array<IPlayerInfluence>;
}

interface IGameStateContext {
  currentPlayerId: string;
  gameStarted: boolean;
  players: Array<IPlayer>;
  turn: string;
  handleGameEvent: (newGameState: IGameState) => void;
  handleGameStateUpdate: (newGameState: IGameState) => void;
  handleStartGame: () => void;
}

export { Influence, IGameState, IPlayerInfluence, IPlayer, IGameStateContext };
