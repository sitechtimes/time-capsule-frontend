<template>
  <div>
    <p>{{ name }} uploaded {{ photoCount }} photos at {{ time }} Click to view</p>
  </div>
  <!-- make it change color when clicked/opened -->
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  photoCount: number;
  time: string;
}>();
</script>

<style scoped></style>
