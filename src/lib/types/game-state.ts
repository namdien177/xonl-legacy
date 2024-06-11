import type { CellCoordinate } from "@/lib/utils";

export type BoardCellState = {
  owner_id: string;
  icon?: string;
};

export type GameState = Array<Array<BoardCellState | null>>;

export type GameLogs = Array<{
  owner_id: "red" | "blue";
  coordinate: CellCoordinate;
}>;
