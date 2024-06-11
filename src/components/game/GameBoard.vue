<template>
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
          @click="emit('onCellCheck', rowIndex, cellIndex)"
          :style="{ height: cellHeight + 'px' }"
          class="border p-4"
        >
          {{ String(`${rowIndex}-${cellIndex}`) }}
          {{ gameState[rowIndex]?.[cellIndex]?.owner_id ?? "" }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { GameState } from "@/lib/types/game-state";
import { computed, onMounted, onUnmounted, ref } from "vue";

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

const props = defineProps({
  colNumber: {
    required: true,
    type: Number,
    default: 3,
  },
  gameState: {
    required: true,
    type: Array as () => GameState,
    validator(value): value is GameState {
      if (!Array.isArray(value)) return false;
      return value.every((row) => Array.isArray(row));
    },
  },
});

type EmitProps = {
  (event: "onCellCheck", rowIndex: number, cellIndex: number): void;
};
const emit = defineEmits<EmitProps>();

const cellHeight = ref(0);
const tableRef = ref<HTMLTableElement | null>(null);

const listenerCell = (): void => {
  const table = tableRef.value;
  if (!table) return;

  const tableWidth = table.offsetWidth;
  cellHeight.value = tableWidth / props.colNumber;
};

const boardState = computed(() => {
  const colNumber = props.colNumber;
  // careful about closure when using this.colNumber with arrow function
  return generateStateCellState(colNumber);
});

onMounted(() => {
  listenerCell();
  window.addEventListener("resize", listenerCell);
});

onUnmounted(() => {
  window.removeEventListener("resize", listenerCell);
});
</script>
