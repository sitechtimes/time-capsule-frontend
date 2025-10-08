<template>
  <div class="card">
    <h3>{{ student.firstName }} {{ student.lastName }}</h3>
    <p>{{ student.graduationYear }} ({{ currentGrade }}th)</p>
    <p>last uploaded:</p>
    <p>total uploads:</p>
    <NuxtLink :to="`/admin-student-view/${student.id}`">See More</NuxtLink>
  </div>
</template>

<script setup lang="ts">
// figure out props later, make student type?
const props = defineProps<{
  student: Student;
}>();
const currentYear = new Date().getFullYear();
function getStudentGrade(graduationYear: number): number | string {
  const grade = 12 - (graduationYear - currentYear);
  if (grade < 1) {
    return "Student has not started school yet";
  } else if (grade > 12) {
    return "Student has already graduated";
  }
  return grade;
}
const currentGrade = ref<number | string>();
currentGrade.value = getStudentGrade(props.student.graduationYear);
</script>

<style scoped></style>
