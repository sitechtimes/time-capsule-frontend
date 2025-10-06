<template>
  <div>
    <!-- when clicked, open page for individual student info -->
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

async function fetchIndividualStudentUploads(id) {
  // /photos endpoint should filter for specific student by id
}

onMounted(() => {
  void fetchStudents();
});
</script>

<style scoped></style>
