<template>
  <div class="flex flex-col container mx-auto p-8 gap-4">
    <div v-if="activeGame" class="p-4 flex items-center gap-4">
      <div class="flex flex-col">
        <h1 class="text-xl">Active Game</h1>
        <p>You are playing a game.</p>
      </div>

      <router-link
        :to="`/game/room/${activeGame.id}`"
        :class="buttonVariants({})"
        >Back to the game
      </router-link>
    </div>

    <div v-else class="flex flex-col gap-4">
      <div class="flex flex-col pb-4 border-b">
        <h1 class="text-xl">No active game</h1>
        <p>You are not playing any game.</p>
      </div>

      <div class="flex flex-col md:flex-row md:justify-start">
        <router-link to="/game/create" :class="buttonVariants({})"
          >Start a new game
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { buttonVariants } from "@/components/ui/button";

export default {
  methods: { buttonVariants },
  computed: {
    activeGame() {
      return this.$store.state.playingGame;
    },
  },
};
</script>
