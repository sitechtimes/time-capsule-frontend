<template>
  <NuxtLink to="/admin-student-view">← Back to All Students</NuxtLink>
  <p v-if="!store.student">No student selected</p>
  <div v-else>
    <h1>Student Details</h1>
    <p>ID: {{ $route.params.id }}</p>
    <p>Name: {{ student?.firstName }} {{ student?.lastName }}</p>
    <p>{{ student?.graduationYear }} ({{ currentGrade }})</p>
    <p>Total Uploads: {{ studentUploads?.length }}</p>
    <p>Most recent upload: {{ mostRecentUploadDate }}</p>
    <p v-if="!studentUploads || studentUploads.length === 0">No uploads to show</p>
    <div v-else class="flex flex-row">
      <PhotoCard v-for="photo in studentUploads" :photo-data="photo" />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStudentStore();
const student = store.student;
const currentGrade = ref<number | string>();
if (student) currentGrade.value = getStudentGrade(student.graduationYear);

const studentUploads = ref<Photo[]>();
const mostRecentUploadDate = ref<string>("");

interface PhotoResponse {
  id: number;
  uploadDate: number;
  graduationYear: number;
  event: string;
  location: string;
  people: string[];
  imageData: string;
  author: string;
}
function formatPhotoDate(photos: PhotoResponse[]) {
  return photos.map((item) => ({
    ...item,
    uploadDate: new Date(item.uploadDate * 1000)
  }));
}

//backend should have endpoint for fetching specific students' photos instead of fetching all and then filtering
async function fetchIndividualStudentUploads(name: string) {
  const { data, error } = await tryRequestEndpoint<PhotoResponse[]>("/photos");
  if (error) return error;
  const filteredData = data?.filter((photo) => photo.author === name);
  const newPhotoArray = formatPhotoDate(filteredData);
  studentUploads.value = newPhotoArray;
}

function getMostRecentUploadDate(photos: Photo[]): string {
  // does this assume photos is not empty, not undefined, or both???
  const mostRecentPhoto = photos.reduce((max, photo) => (photo.uploadDate > max.uploadDate ? photo : max));
  return mostRecentPhoto.uploadDate.toLocaleDateString();
}
onMounted(async () => {
  const name = `${student?.firstName} ${student?.lastName}`;
  await fetchIndividualStudentUploads(name);
  mostRecentUploadDate.value = studentUploads.value?.length ? getMostRecentUploadDate(studentUploads.value) : "N/A - student has no uploads";
});

definePageMeta({
  layout: "dashboard"
});
</script>
