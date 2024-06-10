export type BoardCellState = {
  owner_id: string;
  icon?: string;
};

export type GameState = Array<Array<BoardCellState | null>>;
