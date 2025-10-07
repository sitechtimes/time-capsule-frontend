<template>
  <div>
    <!-- when clicked, open page for individual student info -->
    <StudentCard v-for="student in students" :student="student">
      <NuxtPage :to="`/admin-student-view/${student.id}`" />
    </StudentCard>
  </div>
</template>

<script setup lang="ts">
// update this to fetch only students w/ /users/students endpoint or something
const students = ref<Student[]>([]);
const studentUploads = ref<Photo[]>();
async function fetchStudents() {
  const { data, error } = await tryRequestEndpoint<Student[]>("/users");
  if (error) return error;
  students.value = data;
}

async function fetchIndividualStudentUploads(author) {
  // /photos endpoint should filter for specific student by name (or id?)
  // const { data, error } = await tryRequestEndpoint<Photo[]>(`/photos/${author}`);
  // lines 22-23 below are temporary
  const { data, error } = await tryRequestEndpoint<Photo[]>("/photos");
  const filteredData = data?.filter((photo) => photo.author === author);
  if (error) return error;
  studentUploads.value = filteredData;
}

onMounted(() => {
  void fetchStudents();
});
</script>

<style scoped></style>
