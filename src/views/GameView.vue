<template>
  <div class="w-full h-[calc(100vh-3.5rem-1px)] flex gap-4">
    <div class="flex-1 flex flex-col p-4 gap-4 overflow-auto relative">
      <div class="flex flex-col sticky top-0 bg-background inset-x-0 pb-4">
        <div
          :class="
            cn('flex w-full rounded-lg p-4', {
              'from-red-600 bg-gradient-to-r to-blue-600':
                winningState === null,
              'bg-red-600': winningState?.winner === 'red',
              'bg-blue-600': winningState?.winner === 'blue',
            })
          "
        >
          <div
            v-if="!winningState?.winner || winningState?.winner === 'red'"
            :class="
              cn(
                'flex-1 relative flex items-center text-white font-bold',
                winningState?.winner === 'red'
                  ? 'justify-center'
                  : 'justify-start'
              )
            "
          >
            RED {{ winningState?.winner === "red" ? "WON" : "" }}
          </div>
          <div
            v-if="!winningState?.winner || winningState?.winner === 'blue'"
            :class="
              cn(
                'flex-1 relative flex items-center text-white font-bold',
                winningState?.winner === 'blue'
                  ? 'justify-center'
                  : 'justify-end'
              )
            "
          >
            BLUE {{ winningState?.winner === "blue" ? "WON" : "" }}
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col">
        <h1 class="text-xl">Board</h1>
        {{ winningState }}
        <GameBoard
          :col-number="colNumber"
          :game-state="gameState"
          @cell-selected="onCellCheck"
        ></GameBoard>
        <p v-if="usersLoading">Loading...</p>
        <ul v-else>
          <li v-for="user in users" :key="user.id">
            {{ user.name }}
          </li>
        </ul>
      </div>
    </div>

    <div class="w-1/4 min-w-[256px] max-w-[360px] bg-gray-300">Game Info</div>
  </div>
</template>

<script lang="ts">
import {
  type CellCoordinate,
  cn,
  generateWinCombinations,
  isWinningWithMoves,
  type WinCondition,
} from "@/lib/utils";
import type { GameLogs, GameState } from "@/lib/types/game-state";
import GameBoard from "@/components/game/GameBoard.vue";
import { execQuery } from "@/lib/http/exec-query";
import ky from "ky";

type User = {
  id: number;
  name: string;
  email: string;
};

export default {
  components: { GameBoard },
  methods: {
    cn,
    onCellCheck([rowIndex, cellIndex]: CellCoordinate): void {
      const row = this.gameState[rowIndex];
      if (!row) {
        this.$set(this.gameState, rowIndex, []);
      }

      const cell = this.gameState[rowIndex];
      // Prevent overwriting cell
      if (cell[cellIndex]) return;

      this.$set(this.gameState[rowIndex], cellIndex, {
        owner_id: this.ownerTurn,
      });
      this.gameLogs.push({
        owner_id: this.ownerTurn,
        coordinate: [rowIndex, cellIndex],
      });
      // flip the turn
      this.ownerTurn = this.ownerTurn === "red" ? "blue" : "red";
    },
  },
  data() {
    return {
      colNumber: 3,
      ownerTurn: "red" as "red" | "blue",
      gameState: [] as GameState,
      gameLogs: [] as GameLogs,
      users: [] as User[],
      usersLoading: false,
    };
  },
  computed: {
    winCombinations(): Array<WinCondition> {
      return generateWinCombinations(this.colNumber);
    },
    winningState() {
      const moves = this.gameState;
      const combinations = this.winCombinations;
      const winInfo = isWinningWithMoves(moves, combinations);
      if (winInfo?.winner) {
        console.log(winInfo);
      }
      return winInfo;
    },
  },
  watch: {
    "gameLogs.length"(moveLength) {
      // the limit is n^2-1 moves
      const limitMoveLength = this.colNumber ** 2 - 1;
      if (moveLength <= limitMoveLength) {
        return;
      }

      // remove the last move from the game state and log
      const lastMove = this.gameLogs.shift();
      if (!lastMove) {
        return;
      }

      const [rowIndex, cellIndex] = lastMove.coordinate;
      this.$set(this.gameState[rowIndex], cellIndex, null);
    },
  },
  mounted() {
    execQuery({
      queryFn: () =>
        ky
          .get("https://jsonplaceholder.typicode.com/users")
          .json<Array<User>>(),
      onLoading: (isLoading) => {
        this.usersLoading = isLoading;
      },
      onResolve: (users) => {
        this.users = users;
      },
    });
  },
};
</script>
