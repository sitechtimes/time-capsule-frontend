<template>
  <div>
    <label :for="category" class="mb-1 block">
      <span class="mb-1 block">{{ category }}</span>
    </label>
    <select v-model="modelValue" class="select select-bordered w-full" :name="category">
      <option value="All">All</option>
      <option v-for="choice in choices" :key="choice" :value="choice">
        {{ choice }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  category: "Graduation Year" | "Month" | "Year" | "Event" | "Location";
  choices: string[] | number[];
}>();

const modelValue = defineModel<string | number>();
</script>

<style scoped></style>
