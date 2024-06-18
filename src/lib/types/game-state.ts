export type MoveCoordinate = [row: number, col: number];

export type WinningCombination = Array<MoveCoordinate>;

export type GameState = Array<Array<GamePlayer | null>>;

export type GameMove = {
  owner_id: string;
  coordinate: MoveCoordinate;
  timestamp: string;
};

export type GameLogs = Array<GameMove>;

export type GamePlayer = {
  id: string;
  name: string;
};

export type GameWinMode = "until-win" | "normal";

export type GamePlayers = [GamePlayer, GamePlayer];

export type Game = {
  id: string;
  name: string;
  players: [GamePlayer, GamePlayer | null];
  status: "waiting" | "playing" | "finished";
  winMode: GameWinMode;
  colMode: number;
  winner?: GamePlayer;
  winCombination?: WinningCombination;
  currentTurn?: GamePlayer;
  boardState: GameState;
  moves: GameLogs;
  logs: GameLogs;
};

export type GameCreatePayload = Omit<
  Game,
  "id" | "logs" | "moves" | "boardState"
>;

export type MakeGameWinner = {
  winner_id: string;
  winCombination: WinningCombination;
};
