<template>
  <router-link
    :to="to"
    :class="
      cn(
        buttonVariants({
          variant: 'ghost',
        }),
        className
      )
    "
    :active-class="activeClassName"
  >
    <slot />
  </router-link>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

defineProps({
  to: {
    type: String,
    required: true,
  },
  className: {
    type: String,
  },
  activeClassName: {
    type: String,
    default: "font-bold",
  },
});
</script>
