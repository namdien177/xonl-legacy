import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type {
  GameState,
  MoveCoordinate,
  WinningCombination,
} from "@/lib/types/game-state";
import type { MakeWinnerProps } from "@/state/game.module";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateWinCombinations(size: number) {
  // Generate horizontal and vertical win combinations
  const horizontal: Array<WinningCombination> = [];
  const vertical: Array<WinningCombination> = [];

  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    for (let colIndex = 0; colIndex < size; colIndex++) {
      const cell: MoveCoordinate = [rowIndex, colIndex];

      if (!horizontal[rowIndex]) {
        horizontal[rowIndex] = [];
      }
      const horizontalConditionAtRow = horizontal[rowIndex];
      horizontalConditionAtRow.push(cell);

      if (!vertical[colIndex]) {
        vertical[colIndex] = [];
      }
      const cellConditionAtCell = vertical[colIndex];
      cellConditionAtCell.push(cell);
    }
  }

  // Generate diagonal win combinations
  const diagonalLeftRight = [];
  const diagonalRightLeft = [];

  for (let xyCoordinate = 0; xyCoordinate < size; xyCoordinate++) {
    const leftEndCell: MoveCoordinate = [xyCoordinate, xyCoordinate];
    const rightEndCell: MoveCoordinate = [
      xyCoordinate,
      size - xyCoordinate - 1,
    ];

    diagonalLeftRight.push(leftEndCell);
    diagonalRightLeft.push(rightEndCell);
  }

  return [...horizontal, ...vertical, diagonalLeftRight, diagonalRightLeft];
}

export function isWinningWithMoves(
  moves: GameState,
  winCombinations: WinningCombination[]
): MakeWinnerProps | null {
  // check if there is a wining combination match and who match it
  let winner_id: string | null = null;
  let combination: WinningCombination | null = null;

  for (const winCombination of winCombinations) {
    let currentOwner = null;
    for (const cells of winCombination) {
      const [row, cell] = cells;
      const cellOwner = moves[row]?.[cell]?.id;
      if (!cellOwner) {
        currentOwner = null;
        break;
      }

      if (!currentOwner) {
        currentOwner = cellOwner;
      } else if (currentOwner !== cellOwner) {
        currentOwner = null;
        break;
      }
    }

    if (currentOwner) {
      winner_id = currentOwner;
      combination = winCombination;
      break;
    }
  }

  if (!winner_id || !combination) {
    return null;
  }

  return { winner_id, winCombination: combination };
}
