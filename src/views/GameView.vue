<template>
  <div class="w-full h-[calc(100vh-3.5rem-1px)] flex gap-4">
    <div class="flex-1 flex flex-col p-4 gap-4">
      <div class="flex flex-col">
        <div
          :class="
            cn('flex w-full rounded-lg p-4', {
              'from-red-600 bg-gradient-to-r to-blue-600': winingState === null,
              'bg-red-600': winingState?.winner === 'red',
              'bg-blue-600': winingState?.winner === 'blue',
            })
          "
        >
          <div
            v-if="!winingState?.winner || winingState?.winner === 'red'"
            :class="
              cn(
                'flex-1 relative flex items-center text-white font-bold',
                winingState?.winner === 'red'
                  ? 'justify-center'
                  : 'justify-start'
              )
            "
          >
            RED {{ winingState?.winner === "red" ? "WON" : "" }}
          </div>
          <div
            v-if="!winingState?.winner || winingState?.winner === 'blue'"
            :class="
              cn(
                'flex-1 relative flex items-center text-white font-bold',
                winingState?.winner === 'blue'
                  ? 'justify-center'
                  : 'justify-end'
              )
            "
          >
            BLUE {{ winingState?.winner === "blue" ? "WON" : "" }}
          </div>
        </div>
      </div>

      <div class="flex-1 border p-4 rounded-lg flex flex-col">
        <h1 class="text-xl">Board</h1>
        {{ winingState }}
        <GameBoard
          :colNumber="colNumber"
          :game-state="gameState"
          @onCellCheck="onCellCheck"
        ></GameBoard>
      </div>
      <div class="w-1/4 min-w-[256px] max-w-[360px] bg-gray-300">Game Info</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Vue, { computed, ref } from "vue";
import type { GameState } from "@/lib/types/game-state";
import { cn, generateWinCombinations, isWinningWithMoves } from "@/lib/utils";
import GameBoard from "@/components/game/GameBoard.vue";

const colNumber = ref(3);
const winCombinations = computed(() =>
  generateWinCombinations(colNumber.value)
);
const gameState = ref<GameState>([]);
const ownerTurn = ref<"red" | "blue">("red");

const onCellCheck = (rowIndex: number, cellIndex: number) => {
  const row = gameState.value[rowIndex];

  if (!row) {
    Vue.set(gameState.value, rowIndex, []);
  }
  const cell = gameState.value[rowIndex];
  if (cell[cellIndex]) return;
  Vue.set(gameState.value[rowIndex], cellIndex, {
    owner_id: ownerTurn.value,
  });
  ownerTurn.value = ownerTurn.value === "red" ? "blue" : "red";
};

const winingState = computed(() => {
  const moves = gameState.value;
  const combinations = winCombinations.value;
  return isWinningWithMoves(moves, combinations);
});
</script>
