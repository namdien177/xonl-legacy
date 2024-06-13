<template>
  <div class="flex flex-col sticky top-0 bg-background inset-x-0 pb-4">
    <div
      :class="
        cn('flex w-full rounded-lg p-4', {
          'from-red-600 bg-gradient-to-r to-blue-600': !winner?.id,
          'bg-red-600': isFirstPlayerWon,
          'bg-blue-600': isSecondPlayerWon,
        })
      "
    >
      <div
        v-if="!winner?.id || isFirstPlayerWon"
        :class="
          cn(
            'flex-1 relative flex items-center text-white font-bold',
            isFirstPlayerWon ? 'justify-center' : 'justify-start'
          )
        "
      >
        {{ players[0].name ?? "Player 1" }}
        {{ isFirstPlayerWon ? "WON" : "" }}
      </div>
      <div
        v-if="!winner?.id || isSecondPlayerWon"
        :class="
          cn(
            'flex-1 relative flex items-center text-white font-bold',
            isSecondPlayerWon ? 'justify-center' : 'justify-end'
          )
        "
      >
        {{ players[1].name ?? "Player 2" }}
        {{ isSecondPlayerWon ? "WON" : "" }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { GamePlayer } from "@/lib/types/game-state";
import { cn } from "@/lib/utils";

export default {
  methods: { cn },
  computed: {
    players(): [GamePlayer, GamePlayer] {
      return (
        this.$store.state.playingGame?.players ?? [
          { id: "red", name: "Player 1" },
          { id: "blue", name: "Player 2" },
        ]
      );
    },
    winner(): GamePlayer | null {
      return this.$store.state.playingGame?.winner ?? null;
    },
    isFirstPlayerWon(): boolean {
      return this.winner?.id === this.players[0].id;
    },
    isSecondPlayerWon(): boolean {
      return this.winner?.id === this.players[1].id;
    },
  },
};
</script>
