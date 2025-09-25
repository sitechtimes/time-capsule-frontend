<template>
  <div>
    <h3>{{ name }}</h3>
    <p>{{ gradYear }} ({{ currentGrade }})</p>
    <p>last uploaded:</p>
    <p>total uploads:</p>
  </div>
</template>

<script setup lang="ts">
// figure out props later, make student type?
const props = defineProps<{
  name: string;
  gradYear: number;
}>();
const currentYear = new Date().getFullYear();
const currentGrade = ref<number>();
</script>

<style scoped></style>
