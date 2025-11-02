<template>
  <div class="flex flex-row">
    <p>{{ name }} uploaded {{ photoCount }} photos at {{ time }} on [date]</p>
    <button class="btn" @click="$emit('clicked')">click to view</button>
  </div>
  <!-- make it change color when clicked/opened -->
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  photoCount: number;
  date: string;
}>();
</script>

<style scoped></style>
