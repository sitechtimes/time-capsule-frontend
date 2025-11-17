<template>
  <div>
    <label :for="category" class="label dark:text-neutral-content font-semibold uppercase">
      <span class="label-text m-2 text-base">{{ category }}</span>
    </label>
    <select v-model="modelValue" class="select select-bordered w-full" :name="category">
      <option class="text-[#5D6A7B]" value="All">All</option>
      <option class="text-[#5D6A7B]" v-for="choice in choices" :key="choice" :value="choice">
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
