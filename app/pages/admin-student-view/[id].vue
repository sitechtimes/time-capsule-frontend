<template>
  <NuxtLink to="/admin-student-view">← Back to All Students</NuxtLink>
  <p v-if="!store.student">No student selected</p>
  <div v-else class="card">
    <h1>Student Details</h1>
    <p>ID: {{ $route.params.id }}</p>
    <p>Name: {{ student?.firstName }} {{ student?.lastName }}</p>
    <p>{{ student?.graduationYear }} ({{ currentGrade }})</p>
    <p v-if="!store.studentUploads">This student has no uploads</p>
    <div v-else class="flex flex-row">
      <PhotoCard v-for="photo in studentUploads" :photo-data="photo" />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStudentStore();
const student = store.student;
const studentUploads = store.studentUploads;
const currentGrade = ref<number | string>();
if (student) currentGrade.value = getStudentGrade(student.graduationYear);
definePageMeta({
  layout: "dashboard"
});
</script>
