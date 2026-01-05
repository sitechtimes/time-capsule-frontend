<template>
  <div class="flex min-h-screen">
    <SideBar v-model:search-inputs="searchInputs" />
    <div class="bg-base-100 flex max-h-screen w-full flex-row flex-wrap overflow-y-auto p-4">
      <PhotoCard v-for="(photo, index) in filteredPhotoData" :key="photo.id" :photo-data="photo" @delete="openConfirmDeleteModal(index)" @clicked="openModal(photo)" />
      <PhotoModal ref="modalRef" :selected-photo="selectedPhoto" />
      <ConfirmModal
        v-if="showConfirmDeleteModal"
        title="Confirm Delete"
        message="Are you sure you want to delete this photo?"
        @cancel="showConfirmDeleteModal = false"
        @confirm="deletePhoto(deletePhotoIndex)"
      />
    </div>
    <div class="uploadnav fixed right-6 bottom-6 z-50">
      <NuxtLink to="/upload" class="btn btn-circle btn-ghost btn-lg">
        <img src="/add-circle.svg" aria-hidden="true" class="color-secondary h-12 opacity-60 select-none dark:invert" draggable="false" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// filters should be done on backend, not here bc frontend doesn't have ALL photos to filter from
// should there be filter for author? edit btn on card?
// infinite scroll that loads more photos when scrolled down
// deleting from api
// need endpoints - photo limits, events&locations, filtering by user and other stuff
// are users able to see other photos?
const photoData = ref<Photo[]>([]);
const user = useUserStore().user;
const selectedPhoto = ref<Photo>();
const showConfirmDeleteModal = ref(false);
const deletePhotoIndex = ref<number | null>(null);

const modalRef = useTemplateRef("modalRef");

function openModal(selectedPhotoData: Photo) {
  selectedPhoto.value = selectedPhotoData;
  modalRef.value?.openModal();
}

function openConfirmDeleteModal(index: number) {
  deletePhotoIndex.value = index;
  showConfirmDeleteModal.value = true;
}

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

async function fetchPhotoData() {
  const { data, error } = await tryRequestEndpoint<PhotoResponse[]>("/photos");
  if (error) return error;
  let newPhotoArray = formatPhotoDate(data);
  if (user?.userType === "user") {
    newPhotoArray = newPhotoArray.filter((photo) => photo.author === `${user.firstName} ${user.lastName}`);
  }
  photoData.value.push(...newPhotoArray);
}

async function deletePhoto(photoIndex: number | null) {
  if (photoIndex === null) return;
  photoData.value.splice(photoIndex, 1);
  showConfirmDeleteModal.value = false;
}

const searchInputs = reactive({
  uploadDate: ref({
    month: "All",
    year: "All"
  }),
  graduationYear: "All",
  event: "All",
  location: "All",
  people: ref<string[]>([])
});

const filteredPhotoData = computed(() => {
  return photoData.value.filter((photo) => {
    const gradYearMatch = String(photo.graduationYear) === String(searchInputs.graduationYear) || searchInputs.graduationYear === "All" || searchInputs.graduationYear === "";

    const uploadDateMatch =
      (photo.uploadDate.getFullYear() === Number(searchInputs.uploadDate.year) && months[photo.uploadDate.getMonth()] === searchInputs.uploadDate.month) ||
      (photo.uploadDate.getFullYear() === Number(searchInputs.uploadDate.year) && (searchInputs.uploadDate.month === "All" || searchInputs.uploadDate.month === "")) ||
      (months[photo.uploadDate.getMonth()] === searchInputs.uploadDate.month && (searchInputs.uploadDate.year === "All" || searchInputs.uploadDate.year === "")) ||
      ((searchInputs.uploadDate.year === "All" || searchInputs.uploadDate.year === "") && (searchInputs.uploadDate.month === "All" || searchInputs.uploadDate.month === ""));

    const eventMatch = photo.event.toLowerCase().includes(searchInputs.event.toLowerCase()) || searchInputs.event === "All";

    const locationMatch = photo.location.toLowerCase().includes(searchInputs.location.toLowerCase()) || searchInputs.location === "All";

    const peopleMatch = searchInputs.people.every((person) => photo.people.includes(person)) || searchInputs.people.length === 0;

    return gradYearMatch && uploadDateMatch && eventMatch && locationMatch && peopleMatch;
  });
});

definePageMeta({
  layout: "dashboard"
});

const recentlyUploadedPhotos = useUserStore().photos;
photoData.value.push(...recentlyUploadedPhotos);
onMounted(fetchPhotoData);
</script>

<style scoped></style>
