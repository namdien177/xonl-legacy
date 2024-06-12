<template>
  <component
    :is="variant"
    :class="cn(typographyVariants({ variant, affects }), className)"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import {
  type TypographyVariants,
  typographyVariants,
} from "@/components/ui/typography/variants";
import { cn } from "@/lib/utils";

type Variants = TypographyVariants["variant"];

type Affects = TypographyVariants["affects"];

export default {
  methods: { typographyVariants, cn },
  props: {
    className: {
      type: String,
    },
    variant: {
      type: String as () => Variants,
      default: "p",
      validator: (value: Variants) => {
        if (!value) {
          return true;
        }
        return ["h1", "h2", "h3", "h4", "h5", "h6", "p"].includes(value);
      },
    },
    affects: {
      type: String as () => Affects,
      default: "default",
      validator: (value: Affects) => {
        if (!value) {
          return true;
        }
        return [
          "default",
          "lead",
          "large",
          "small",
          "muted",
          "removePMargin",
        ].includes(value);
      },
    },
  },
};
</script>
