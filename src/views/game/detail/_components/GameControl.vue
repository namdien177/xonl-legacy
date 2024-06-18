<template>
  <div class="flex flex-col w-full">
    <button v-if="gameIsWaiting" @click="onStartGame" :class="buttonVariants()">
      Start Game
    </button>
    <button
      v-if="gameIsPlaying || gameIsOver"
      @click="onRestartGame"
      :class="buttonVariants()"
    >
      Restart Game
    </button>
  </div>
</template>

<script lang="ts">
import { buttonVariants } from "@/components/ui/button";
import { defineComponent } from "vue";
import { STATE_MODULE } from "@/state";
import type { GameModuleState } from "@/state/game-module";
import type { Game } from "@/lib/types/game-state";

export default defineComponent({
  computed: {
    gameStateModule(): GameModuleState {
      return this.$store.state[STATE_MODULE.GAME];
    },
    activeGame(): Game | null {
      return this.gameStateModule.activeGame;
    },
    gameIsWaiting(): boolean {
      return this.activeGame?.status === "waiting";
    },
    gameIsPlaying(): boolean {
      return this.activeGame?.status === "playing";
    },
    gameIsOver(): boolean {
      return this.activeGame?.status === "finished";
    },
  },
  emits: {
    "start-game"(): boolean {
      return true;
    },
    "restart-game"(): boolean {
      return true;
    },
  },
  methods: {
    buttonVariants,
    onStartGame() {
      this.$emit("start-game");
    },
    onRestartGame() {
      this.$emit("restart-game");
    },
  },
});
</script>
