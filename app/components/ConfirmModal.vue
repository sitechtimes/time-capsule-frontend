<template>
  <div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-[#eeeeeedc]">
    <div class="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
      <h3 class="mb-4 text-lg font-semibold">{{ title }}</h3>
      <p class="mb-6 text-gray-700">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button @click="$emit('cancel')" class="rounded-xl bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">Cancel</button>
        <button @click="$emit('confirm')" class="bg-secondary rounded-xl px-4 py-2 text-white hover:bg-[#3E69A3]">Confirm</button>
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
