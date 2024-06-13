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

export default {
  computed: {
    activeGame() {
      return this.$store.state.playingGame;
    },
    gameIsWaiting() {
      return this.$store.state.playingGame?.status === "waiting";
    },
    gameIsPlaying() {
      return this.$store.state.playingGame?.status === "playing";
    },
    gameIsOver() {
      return this.$store.state.playingGame?.status === "finished";
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
};
</script>
