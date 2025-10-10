<template>
  <div class="card">
    <h3>{{ student.firstName }} {{ student.lastName }}</h3>
    <p>{{ student.graduationYear }} ({{ currentGrade }}th)</p>
    <p>last uploaded:</p>
    <p>total uploads:</p>
    <!-- is there a way to use nuxtlink w this -->
    <button @click="openStudentPage(student)">See More</button>
  </div>
</template>

<script setup lang="ts">
// figure out props later, make student type?
const props = defineProps<{
  student: Student;
}>();

const currentGrade = ref<number | string>();
currentGrade.value = getStudentGrade(props.student.graduationYear);

const router = useRouter();
function openStudentPage(student: Student) {
  void router.push(`/admin-student-view/${student.id}`);
}
</script>

<style scoped></style>
