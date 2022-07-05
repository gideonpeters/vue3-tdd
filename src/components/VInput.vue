<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <input
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
      :id="id"
      class="form-control"
      :class="{ 'is-invalid': help }"
    />
    <span
      v-if="help"
      class="alert alert-danger mt-2"
      :class="{ 'invalid-feedback': help }"
      >{{ help }}</span
    >
  </div>
</template>

<script>
export default {
  emits: ["update:modelValue"],
  name: "VInput",
  props: {
    label: String,
    id: String,
    help: String,
    modelValue: [String],
  },
};
</script>
