<template>
  <div class="w-full h-[calc(100vh-3.5rem-1px)] flex gap-4">
    <div class="flex-1 flex flex-col p-4 gap-4">
      <div class="flex flex-col">
        <div
          class="flex from-red-600 bg-gradient-to-r to-blue-600 w-full rounded-lg p-4"
        >
          <div
            class="flex-1 relative flex items-center justify-start text-white"
          >
            RED
          </div>
          <div class="flex-1 relative flex items-center justify-end text-white">
            BLUE
          </div>
        </div>
      </div>

      <div class="flex-1 border p-4 rounded-lg">
        <h1 class="text-xl">Board</h1>
      </div>
    </div>
    <div class="w-1/4 min-w-[256px] max-w-[360px] bg-gray-300">Game Info</div>
  </div>
</template>
<script setup lang="ts"></script>
