<template>
  <div class="bg-opacity-50 bg-[rgba(0, 0, 0, 0.23)] fixed inset-0 z-50 flex items-center justify-center">
    <div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
      <h3 class="mb-4 text-lg font-semibold">{{ title }}</h3>
      <p class="mb-6 text-gray-700">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button @click="$emit('cancel')" class="rounded-xl bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">Cancel</button>
        <button @click="$emit('confirm')" class="rounded=xl bg-secondary rounded px-4 py-2 text-white hover:bg-[#3E69A3]">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
}>();
</script>

<style scoped></style>
