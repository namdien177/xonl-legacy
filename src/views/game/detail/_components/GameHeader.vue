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
        {{ players[0]?.name ?? "Player 1" }}
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
        {{ players[1]?.name ?? "Player 2" }}
        {{ isSecondPlayerWon ? "WON" : "" }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Game, GamePlayer } from "@/lib/types/game-state";
import { cn } from "@/lib/utils";
import { defineComponent } from "vue";
import { STATE_MODULE } from "@/state";
import type { GameModuleState } from "@/state/game-module";

export default defineComponent({
  methods: { cn },
  computed: {
    gameStateModule(): GameModuleState {
      return this.$store.state[STATE_MODULE.GAME];
    },
    playingGame(): Game | null {
      return this.gameStateModule.activeGame;
    },
    players(): [] | [GamePlayer, GamePlayer | null] {
      if (!this.playingGame) {
        return [];
      }
      return this.playingGame.players;
    },
    winner(): GamePlayer | null {
      return this.playingGame?.winner ?? null;
    },
    isFirstPlayerWon(): boolean {
      if (!this.winner || !this.players[0]) {
        return false;
      }
      return this.winner.id === this.players[0].id;
    },
    isSecondPlayerWon(): boolean {
      if (!this.winner || !this.players[1]) {
        return false;
      }
      return this.winner.id === this.players[1].id;
    },
  },
});
</script>
