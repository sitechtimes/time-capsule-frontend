<template>
  <div class="card w-[20%]">
    <h3>{{ student.firstName }} {{ student.lastName }}</h3>
    <p>{{ student.graduationYear }} ({{ currentGrade }})</p>
    <button @click="openStudentPage(student)" class="btn">See More</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  student: Student;
}>();

const store = useStudentStore();
const currentGrade = ref<number | string>();
currentGrade.value = getStudentGrade(props.student.graduationYear);

const router = useRouter();
function openStudentPage(student: Student) {
  store.student = student;
  void router.push(`/admin-student-view/${student.id}`);
}
</script>

<style scoped></style>
