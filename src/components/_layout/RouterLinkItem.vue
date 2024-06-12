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

<script lang="ts">
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default {
  methods: {
    buttonVariants,
    cn,
  },
  props: {
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
  },
};
</script>
