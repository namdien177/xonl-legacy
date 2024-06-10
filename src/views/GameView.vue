<template>
  <div class="w-full h-[calc(100vh-3.5rem-1px)] flex gap-4">
    <div class="flex-1 flex flex-col p-4 gap-4">
      <div class="flex flex-col">
        <div
          class="flex from-red-600 bg-gradient-to-r to-blue-600 w-full rounded-lg p-4"
        >
          <div
            class="flex-1 relative flex items-center justify-start text-white font-bold"
          >
            RED
          </div>
          <div
            class="flex-1 relative flex items-center justify-end text-white font-bold"
          >
            BLUE
          </div>
        </div>
      </div>

      <div class="flex-1 border p-4 rounded-lg flex flex-col">
        <h1 class="text-xl">Board</h1>
        <table ref="tableRef" class="border border-collapse w-full table-fixed">
          <colgroup>
            <col v-for="n in colNumber" :key="n" />
          </colgroup>
          <tbody>
            <tr v-for="(row, rowIndex) in boardState" :key="rowIndex">
              <td
                v-for="(cell, cellIndex) in row"
                :key="`${rowIndex}-${cellIndex}-${
                  gameState[rowIndex]?.[cellIndex]?.owner_id ?? 'uncheck'
                }`"
                class="border p-4"
                :style="{ height: cellHeight + 'px' }"
                @click="onCellCheck(rowIndex, cellIndex)"
              >
                {{ String(`${rowIndex}-${cellIndex}`) }}
                {{ gameState[rowIndex]?.[cellIndex]?.owner_id ?? "" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="w-1/4 min-w-[256px] max-w-[360px] bg-gray-300">Game Info</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import type { GameState } from "@/lib/types/game-state";

const generateStateCellState = (gridLength: number): GameState => {
  const state = [];
  for (let i = 0; i < gridLength; i++) {
    const row = [];
    for (let j = 0; j < gridLength; j++) {
      row.push(null);
    }
    state.push(row);
  }

  return state;
};

const colNumber = ref(3);
const tableRef = ref(null);
const cellHeight = ref(0);
const boardState = computed(() => generateStateCellState(colNumber.value));
const gameState = ref<GameState>([]);
const ownerTurn = ref<"red" | "blue">("red");

const listenerCell = () => {
  if (!tableRef.value) return;

  // re-compute cell height when window resize
  const tableWidth = (tableRef.value as HTMLTableElement).offsetWidth;
  cellHeight.value = tableWidth / colNumber.value;
};

const onCellCheck = (rowIndex: number, cellIndex: number) => {
  const row = gameState.value[rowIndex];

  if (!row) {
    gameState.value[rowIndex] = [];
  }
  const cell = gameState.value[rowIndex];
  if (cell[cellIndex]) return;
  gameState.value[rowIndex][cellIndex] = {
    owner_id: ownerTurn.value,
  };
  ownerTurn.value = ownerTurn.value === "red" ? "blue" : "red";
  console.log(rowIndex, cellIndex, gameState);
};

onMounted(() => {
  listenerCell();
  window.addEventListener("resize", listenerCell);
});

onUnmounted(() => window.removeEventListener("resize", listenerCell));
</script>
