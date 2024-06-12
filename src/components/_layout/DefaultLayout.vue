<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-14 max-w-screen-2xl items-center">
      <div class="flex items-center gap-2 flex-1">
        <RouterLinkItem to="/">Home</RouterLinkItem>
        <RouterLinkItem to="/game">Game</RouterLinkItem>
      </div>
    </div>
  </header>
</template>
<script lang="ts">
import RouterLinkItem from "@/components/_layout/RouterLinkItem.vue";

export default {
  components: {
    RouterLinkItem,
  },
};
</script>
