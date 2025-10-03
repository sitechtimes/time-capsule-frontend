<template>
  <div>
    <!-- view students -->
    <StudentCard v-for="student in students" />
  </div>
</template>

<script setup lang="ts">
// fetch all students
const students = ref<User[]>([]);
</script>

<style scoped></style>
