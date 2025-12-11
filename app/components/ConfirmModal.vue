<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(238,238,238,0.5)] backdrop-opacity-80 dark:bg-[rgba(104,105,118,0.5)]">
    <div class="dark:bg-base-100 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
      <h3 class="mb-4 text-lg font-semibold">{{ title }}</h3>
      <p class="mb-6 text-gray-700 dark:text-[#e5e5e5]">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button @click="$emit('cancel')" class="dark:bg-base-300 dark:hover:bg-base-200 rounded-xl bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:text-[#e5e5e5]">Cancel</button>
        <button @click="$emit('confirm')" class="bg-secondary rounded-xl px-4 py-2 text-white hover:bg-[#3E69A3] dark:bg-[#254d82] dark:text-[#e5e5e5] dark:hover:bg-[#183F72]">Confirm</button>
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
