<template>
  <div class="card w-[20%]">
    <h3>{{ student.firstName }} {{ student.lastName }}</h3>
    <p>{{ student.graduationYear }} ({{ currentGrade }})</p>
    <p>last uploaded: {{ mostRecentUploadDate }}</p>
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
async function fetchIndividualStudentUploads(name: string) {
  const { data, error } = await tryRequestEndpoint<PhotoResponse[]>("/photos");
  if (error) return error;
  const filteredData = data?.filter((photo) => photo.author === name);
  const newPhotoArray = formatPhotoDate(filteredData);
  console.log(newPhotoArray);
  studentUploads.value = newPhotoArray;
  store.studentUploads = newPhotoArray;
}

function getMostRecentUploadDate(photos: Photo[]): string {
  // does this assume photos is not empty, not undefined, or both???
  const mostRecentPhoto = photos.reduce((max, photo) => (photo.uploadDate > max.uploadDate ? photo : max));
  return mostRecentPhoto.uploadDate.toLocaleDateString();
}
onMounted(async () => {
  const name = `${props.student.firstName} ${props.student.lastName}`;
  await fetchIndividualStudentUploads(name);
  mostRecentUploadDate.value = studentUploads.value?.length ? getMostRecentUploadDate(studentUploads.value) : "N/A - student has no uploads";
});

const router = useRouter();
function openStudentPage(student: Student) {
  store.student = student;
  void router.push(`/admin-student-view/${student.id}`);
}
</script>

<style scoped></style>
