<template>
  <div class="card w-[20%]">
    <h3>{{ student.firstName }} {{ student.lastName }}</h3>
    <p>{{ student.graduationYear }} ({{ currentGrade }})</p>
    <p>last uploaded: {{ getMostRecentUploadDate(studentUploads) }}</p>
    <p>total uploads: {{ studentUploads?.length }}</p>
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
const studentUploads = ref<Photo[]>();

async function fetchIndividualStudentUploads(name: string) {
  // /photos endpoint should filter for specific student by name (or id?)
  // const { data, error } = await tryRequestEndpoint<Photo[]>(`/photos/${author}`);
  // lines 25-26 below are temporary
  const { data, error } = await tryRequestEndpoint<Photo[]>("/photos");
  const filteredData = data?.filter((photo) => photo.author === name);
  if (error) return error;
  studentUploads.value = filteredData;
  store.studentUploads = filteredData;
}
onMounted(async () => {
  const name = `${props.student.firstName} ${props.student.lastName}`;
  await fetchIndividualStudentUploads(name);
});

function getMostRecentUploadDate(photos: Photo[]) {
  const mostRecentPhotoDate = photos.reduce((max, photo) => (photo.uploadDate > max ? photo.uploadDate : max.uploadDate));
  -
}

const router = useRouter();
function openStudentPage(student: Student) {
  store.student = student;
  void router.push(`/admin-student-view/${student.id}`);
}
</script>

<style scoped></style>
