<template>
  <div>
    <h1>Student Details</h1>
    <p>ID: {{ route.params.id }}</p>
    <NuxtLink to="/admin-student-view">← Back to Students</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
</script>
