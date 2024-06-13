<template>
  <div
    class="flex flex-col gap-4 bg-gray-50 rounded-t-lg md:rounded-tr-none md:rounded-l-lg shadow p-2"
  >
    <h1 class="text-xl">Game Logs</h1>
    <hr />
    <ul
      v-if="logs.length > 0"
      class="max-h-60 overflow-auto flex flex-col gap-2 p-2"
    >
      <li
        v-for="(log, index) in logs"
        :key="index"
        class="p-2 hover:bg-muted flex items-center gap-2 rounded-lg"
        v-scroll-into
      >
        <div
          :class="
            cn('flex flex-1 truncate flex-col', {
              'text-red-500': log.owner_id === 'red',
              'text-blue-500': log.owner_id === 'blue',
            })
          "
        >
          <small class="text-xs uppercase text-muted-foreground">user</small>
          <p class="truncate capitalize">{{ log.owner_id }}</p>
        </div>
        <div class="flex flex-col items-end">
          <small class="text-xs text-muted-foreground">
            {{ format(parseISO(log.timestamp), "yyyy-MM-dd HH:mm:ss") }}
          </small>
          <p>{{ log.coordinate }}</p>
        </div>
      </li>
    </ul>
    <div v-else class="text-muted-foreground">No logs</div>
  </div>
</template>
<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { Game } from "@/lib/types/game-state";
import type { ObjectDirective, PropType } from "vue";
import { format, parseISO } from "date-fns";

defineProps({
  logs: {
    type: Array as PropType<Game["logs"]>,
    default: function () {
      return [];
    },
  },
});

const vScrollInto: ObjectDirective = {
  inserted(el: HTMLElement) {
    el.scrollIntoView({ behavior: "smooth", block: "end" });
  },
};
</script>
