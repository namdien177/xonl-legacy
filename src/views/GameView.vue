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
        <table ref="tableRef" class="border border-collapse w-full table-fixed">
          <colgroup>
            <col v-for="n in colNumber" :key="n" />
          </colgroup>
          <tbody>
            <tr v-for="(row, rowIndex) in boardState" :key="rowIndex">
              <td
                v-for="(_, cellIndex) in row"
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
import Vue, { computed, onMounted, onUnmounted, ref } from "vue";
import type { GameState } from "@/lib/types/game-state";
import { cn, generateWinCombinations, type WinCondition } from "@/lib/utils";

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
const winCombinations = computed(() =>
  generateWinCombinations(colNumber.value)
);
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
  console.log(moves);

  // check if there is a wining combination match and who match it
  let winner: string | null = null;
  let combination: WinCondition | null = null;

  for (const winCombination of winCombinations.value) {
    let currentOwner = null;
    for (const cells of winCombination) {
      const [row, cell] = cells;
      const cellOwner = moves[row]?.[cell]?.owner_id;
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
      winner = currentOwner;
      combination = winCombination;
      break;
    }
  }

  if (!winner || !combination) {
    return null;
  }

  return { winner, combination };
});

console.log(winingState.value);

onMounted(() => {
  listenerCell();
  window.addEventListener("resize", listenerCell);
});

onUnmounted(() => window.removeEventListener("resize", listenerCell));
</script>
