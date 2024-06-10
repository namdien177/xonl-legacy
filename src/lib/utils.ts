import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CellCoordinate = [row: number, col: number];
export type WinCondition = Array<CellCoordinate>;

export function generateWinCombinations(size: number) {
  // Generate horizontal and vertical win combinations
  const horizontal: Array<WinCondition> = [];
  const vertical: Array<WinCondition> = [];

  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    for (let colIndex = 0; colIndex < size; colIndex++) {
      const cell: CellCoordinate = [rowIndex, colIndex];

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
    const leftEndCell: CellCoordinate = [xyCoordinate, xyCoordinate];
    const rightEndCell: CellCoordinate = [
      xyCoordinate,
      size - xyCoordinate - 1,
    ];

    diagonalLeftRight.push(leftEndCell);
    diagonalRightLeft.push(rightEndCell);
  }

  return [...horizontal, ...vertical, diagonalLeftRight, diagonalRightLeft];
}
