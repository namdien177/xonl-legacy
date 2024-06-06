<script setup lang="ts">
import { reactive, ref, watch } from "vue";

const props = defineProps<{
  msg: string;
  test: number;
}>();

const fn = (e: Event, message: string) => {
  console.log(e);
  console.log(message);
};

const computedTest = ref(props.test);

const objTest = reactive({
  test: props.test,
});

const increaseFn = () => {
  computedTest.value++;
  objTest.test++;
};

watch(
  () => [objTest],
  (newVal) => {
    console.log(newVal);
  }
);
</script>

<template>
  <div class="greetings">
    <h1 @click="(event) => fn(event, msg)" class="green">{{ msg }}</h1>
    {{ test }}
    <br />
    {{ computedTest }}
    <br />
    {{ JSON.stringify(objTest) }}
    <h3>
      You’ve successfully created a project with
      <a target="_blank" href="https://vitejs.dev/">Vite</a> +
      <a target="_blank" href="https://v2.vuejs.org/">Vue 2</a>. What's next?
    </h3>

    <button @click="increaseFn">Increase</button>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    display: block;
    text-align: left;
  }
}
</style>
