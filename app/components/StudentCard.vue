<template>
  <div class="card w-[20%]">
    <h3>{{ student.firstName }} {{ student.lastName }}</h3>
    <p>{{ student.graduationYear }} ({{ currentGrade }}th)</p>
    <p>last uploaded:</p>
    <p>total uploads:</p>
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

async function fetchIndividualStudentUploads(name: string) {
  // /photos endpoint should filter for specific student by name (or id?)
  // const { data, error } = await tryRequestEndpoint<Photo[]>(`/photos/${author}`);
  // lines 22-23 below are temporary
  const { data, error } = await tryRequestEndpoint<Photo[]>("/photos");
  const filteredData = data?.filter((photo) => photo.author === name);
  if (error) return error;
  store.studentUploads = filteredData;
}

const router = useRouter();
async function openStudentPage(student: Student) {
  store.student = student;
  const name = `${student.firstName} ${student.lastName}`;
  await fetchIndividualStudentUploads(name);
  void router.push(`/admin-student-view/${student.id}`);
}
</script>

<style scoped></style>
