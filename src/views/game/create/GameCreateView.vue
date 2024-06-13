<template>
  <ValidationObserver
    class="container mx-auto p-8 flex flex-col"
    v-slot="{ handleSubmit, invalid }"
  >
    <form
      class="w-full md:max-w-96 flex flex-col border p-8 gap-4 rounded-lg"
      @submit.prevent="handleSubmit(onSubmit)"
    >
      <h1 class="text-xl">Room information</h1>
      <hr />

      <ValidationProvider
        rules="required|min:3"
        v-slot="v"
        class="flex flex-col gap-1"
      >
        <label for="name">Room name</label>
        <input
          type="text"
          v-model="name"
          :class="
            cn(inputVariants(), {
              'border-red-500': v.errors.length,
            })
          "
          id="name"
          placeholder="Room name"
        />
        <span class="text-xs text-red-500">{{ v.errors[0] }}</span>
      </ValidationProvider>

      <button
        :class="buttonVariants({ variant: 'default' })"
        type="submit"
        :disabled="invalid"
      >
        Create room
      </button>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import { inputVariants } from "@/components/ui/input";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default {
  components: { ValidationProvider, ValidationObserver },
  data() {
    return {
      name: null as string | null,
    };
  },
  methods: {
    buttonVariants,
    cn,
    inputVariants,
    onSubmit() {
      const formData = {
        name: this.name,
      };

      console.log(formData);
    },
  },
};
</script>
