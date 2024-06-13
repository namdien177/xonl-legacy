<template>
  <main
    class="flex flex-col h-full md:py-36 md:px-32 pt-11 pb-24 px-8 w-full items-center text-center gap-12"
  >
    <div class="flex flex-col gap-6 items-center">
      <TypographyElement class="max-w-2xl" variant="h1">
        Information you need during on-call emergencies
      </TypographyElement>
      <TypographyElement class="max-w-2xl" variant="h5">
        Quickly link new on-call tickets to similar past incidents and their
        solutions. All directly in Slack the moment an incident happens.
      </TypographyElement>
      <RouterLink to="/sign-in" target="_blank">
        <button
          :class="
            buttonVariants({
              variant: 'ghost',
              size: 'sm',
            })
          "
        >
          Get Started
        </button>
      </RouterLink>
    </div>
    <div class="flex flex-col md:pt-24 md:gap-36 gap-24 items-center">
      <div class="flex flex-col gap-12 items-center">
        <TypographyElement class="max-w-2xl" variant="h1">
          Quick solutions, less stress
        </TypographyElement>
        <div class="flex md:flex-row flex-col gap-12"></div>
      </div>
      <div class="flex flex-col gap-6 max-w-2xl items-center">
        <TypographyElement class="max-w-2xl" variant="h1">
          Instant setup, no custom code
        </TypographyElement>
        <TypographyElement class="max-w-2xl" variant="p">
          Quickly link new on-call tickets to similar past incidents and their
          solutions. All directly in Slack the moment an incident happens.
        </TypographyElement>
      </div>
      <div class="flex flex-col gap-6 items-center">
        <TypographyElement class="max-w-2xl" variant="h1">
          Get in touch
        </TypographyElement>
        <div>Book a demo, or hop on a call</div>
        <Link
          href="https://map.sistilli.dev/public/coding/SaaS+Boilerplate"
          target="_blank"
          :class="
            buttonVariants({
              variant: 'ghost',
              size: 'sm',
            })
          "
        >
          Book now
        </Link>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { RouterLink } from "vue-router";
import { buttonVariants } from "@/components/ui/button";
import { TypographyElement } from "@/components/ui/typography";

export default {
  methods: { buttonVariants },
  components: {
    RouterLink,
    TypographyElement,
  },
};
</script>
