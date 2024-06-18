<script setup lang="ts">
import DefaultLayout from "@/components/_layout/DefaultLayout.vue";
import { inject } from "@vercel/analytics";

const isProd = import.meta.env.PROD;

inject({
  mode: isProd ? "production" : "development",
  framework: "vue",
  debug: !isProd,
});
</script>

<template>
  <div id="app">
    <DefaultLayout />
    <router-view />
  </div>
</template>
