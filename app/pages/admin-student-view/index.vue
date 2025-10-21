<template>
  <div>
    <StudentCard v-for="student in students" :student="student" />
  </div>
</template>

<script setup lang="ts">
// update this to fetch only students w/ /users/students endpoint or something
const students = ref<Student[]>([]);
async function fetchStudents() {
  const { data, error } = await tryRequestEndpoint<Student[]>("/users");
  if (error) return error;
  students.value = data;
}

definePageMeta({
  layout: "dashboard"
});

onMounted(() => {
  void fetchStudents();
});
</script>

<style scoped></style>
