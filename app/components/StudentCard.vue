<template>
  <div class="card bg-base-100 card-sm w-96 shadow-sm">
    <div class="card-body">
      <h2 class="card-title">{{ student.firstName }} {{ student.lastName }}</h2>
      <p>{{ student.graduationYear }} ({{ currentGrade }})</p>
      <p>{{ student.email }}</p>
      <div class="card-actions justify-end">
        <button class="btn" @click="openStudentPage(student)">See More</button>
      </div>
    </div>
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
