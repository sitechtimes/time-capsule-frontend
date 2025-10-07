<template>
  <div>
    <h1>test {{ $route.params.id }}</h1>
    <p>{{ test }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  test: string;
}>();
</script>

<style scoped></style>
