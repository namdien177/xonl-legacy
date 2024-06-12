<template>
  <div class="flex justify-center w-full">
    <table
      ref="tableRef"
      class="border border-collapse w-full max-w-[calc(100vh/2)] min-w-[300px] table-fixed"
    >
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
            @click="onCellClick(rowIndex, cellIndex)"
            :style="{
              height: cellHeight + 'px',
            }"
            :class="
              cn('border p-4 align-middle text-center', {
                'bg-blue-500 text-white':
                  gameState[rowIndex]?.[cellIndex]?.owner_id === 'blue',
                'bg-red-500 text-white':
                  gameState[rowIndex]?.[cellIndex]?.owner_id === 'red',
              })
            "
          >
            {{ String(`${rowIndex}-${cellIndex}`) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import type { GameState } from "@/lib/types/game-state";
import type { PropType } from "vue";
import { defineComponent } from "vue";
import { type CellCoordinate, cn } from "@/lib/utils";

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

export default defineComponent({
  props: {
    colNumber: {
      required: true,
      type: Number,
      default: 3,
    },
    gameState: {
      required: true,
      type: Array as PropType<GameState>,
      validator(value): value is GameState {
        if (!Array.isArray(value)) return false;
        return value.every((row) => Array.isArray(row));
      },
    },
  },
  data() {
    return {
      cellHeight: 0,
    };
  },
  methods: {
    cn,
    listenerCell(): void {
      const table = this.$refs.tableRef as HTMLTableElement | undefined;
      if (!table) return;
      const tableWidth = table.offsetWidth;
      this.cellHeight = tableWidth / this.$props.colNumber;
    },
    onCellClick(rowIndex: number, cellIndex: number): void {
      this.$emit("cell-selected", [rowIndex, cellIndex]);
    },
  },
  emits: {
    "cell-selected"([rowIndex, cellIndex]: CellCoordinate): boolean {
      return rowIndex >= 0 && cellIndex >= 0;
    },
  },
  computed: {
    boardState(): GameState {
      const colNumber = this.$props.colNumber;
      // careful about closure when using this.colNumber with arrow function
      return generateStateCellState(colNumber);
    },
  },
  mounted() {
    this.listenerCell();
    window.addEventListener("resize", this.listenerCell);
  },
  unmounted() {
    window.removeEventListener("resize", this.listenerCell);
  },
});
</script>
