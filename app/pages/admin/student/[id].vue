<template>
  <div class="mx-auto max-w-6xl p-6">
    <NuxtLink to="/admin-student-view" class="btn btn-ghost text-primary hover:bg-base-200 mb-4 flex w-fit items-center gap-2"> ← Back to All Students </NuxtLink>

    <p v-if="!store.student" class="alert alert-warning shadow-lg">No student selected</p>

    <div v-else class="card bg-base-100 p-6 shadow-xl">
      <h1 class="card-title text-primary mb-3 text-2xl">Student Details</h1>

      <div class="mb-4 space-y-2">
        <p><span class="font-semibold">ID:</span> {{ $route.params.id }}</p>
        <p>
          <span class="font-semibold">Name:</span>
          {{ student?.firstName }} {{ student?.lastName }}
        </p>
        <p>
          <span class="font-semibold">Graduation Year:</span>
          {{ student?.graduationYear }}
          <span class="text-sm text-gray-500">({{ currentGrade }})</span>
        </p>
        <p><span class="font-semibold">Total Uploads:</span> {{ studentUploads?.length }}</p>
        <p><span class="font-semibold">Most Recent Upload:</span> {{ mostRecentUploadDate }}</p>
      </div>

      <div>
        <h2 class="mb-4 text-lg font-semibold">Photo Uploads</h2>
        <p v-if="!studentUploads || studentUploads.length === 0" class="text-gray-500 italic">No uploads to show.</p>

        <div v-else class="flex flex-row">
          <PhotoCard v-for="photo in studentUploads" :key="photo.id" :photo-data="photo" @clicked="openModal(photo)" />
        </div>
      </div>
    </div>
    <PhotoModal ref="modalRef" :selected-photo="selectedPhoto" />
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

const selectedPhoto = ref<Photo>();
const modalRef = useTemplateRef("modalRef");
function openModal(selectedPhotoData: Photo) {
  selectedPhoto.value = selectedPhotoData;
  modalRef.value?.openModal();
}
</script>
