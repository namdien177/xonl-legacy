<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type ButtonVariants, buttonVariants } from ".";
import { cn } from "@/lib/utils";

type Props = {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  className?: HTMLAttributes["class"];
};

const props = defineProps<Props>();
</script>

<template>
  <button :class="cn(buttonVariants({ variant, size }), props.className)">
    <slot />
  </button>
</template>
