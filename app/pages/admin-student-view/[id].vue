<template>
  <div class="card">
    <h1>Student Details</h1>
    <p>ID: {{ $route.params.id }}</p>
    <p>Name: {{ student?.firstName }} {{ student?.lastName }}</p>
    <p>{{ student?.graduationYear }} ({{ currentGrade }}th)</p>
    <NuxtLink to="/admin-student-view">← Back to Students</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const store = useStudentStore();
const student = store.student;
const currentGrade = ref<number | string>();
if (student) currentGrade.value = getStudentGrade(student.graduationYear);
definePageMeta({
  layout: "dashboard"
});
</script>
