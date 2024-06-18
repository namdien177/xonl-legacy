<template>
  <div>
    <input
      type="text"
      :class="
        cn(inputVariants(), {
          'border-red-500': errors.length,
        })
      "
      :value="value"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
      :id="id"
      :placeholder="placeholder"
    />
    <span class="text-xs text-red-500">{{ errors[0] }}</span>
  </div>
</template>

<script>
import { inputVariants } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default {
  props: {
    id: {
      type: String,
    },
    value: {
      type: String,
    },
    placeholder: {
      type: String,
      default: "",
    },
    errors: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  emits: ["change", "blur", "focus"],
  methods: {
    cn,
    inputVariants,
    onBlur() {
      this.$emit("blur");
    },
    onFocus() {
      this.$emit("focus");
    },
    /**
     * Handle input event
     * @param event {InputEvent}
     */
    onInput(event) {
      const value = event.target.value;
      console.log("event", value);
      this.$emit("change", value);
    },
  },
};
</script>
