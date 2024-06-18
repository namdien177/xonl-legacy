import { describe, expect, test } from "vitest";
import type { WinningCombination } from "@/lib/types/game-state";
import { generateWinCombinations } from "@/lib/utils";

describe("[generateWinCombinations] should generate win combinations", () => {
  // test implementation

  test("generate a correct win combination", () => {
    const expectCombinations: Array<WinningCombination> = [
      [
        // horizontal first row
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        // horizontal second row
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        // horizontal third row
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        // vertical first column
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        // vertical second column
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        // vertical third column
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        // diagonal left to right
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        // diagonal right to left
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];

    // test implementation
    const generatedCombinations = generateWinCombinations(3);
    expect(generatedCombinations).toEqual(expectCombinations);
  });
});
