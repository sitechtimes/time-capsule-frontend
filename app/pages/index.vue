<template>
  <div class="flex min-h-screen">
    <SideBar v-model:search-inputs="searchInputs" />
    <div class="flex w-full flex-row flex-wrap">
      <PhotoCard v-for="(photo, index) in filteredPhotoData" :key="photo.id" :photo-data="photo" @delete="deletePhoto(index)" @clicked="openModal(photo)" />
      <dialog ref="modalRef" class="modal">
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
              <img src="/close-outline.svg" aria-hidden="true" class="h-6 select-none dark:invert" draggable="false" />
            </button>
          </form>
          <img :src="selectedPhoto?.imageData" aria-hidden="true" class="mx-auto min-h-[70vh] w-auto object-contain" />
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
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

const modalRef = useTemplateRef("modalRef");
function openModal(selectedPhotoData: Photo) {
  selectedPhoto.value = selectedPhotoData;
  modalRef.value?.showModal();
}

interface PhotoResponse {
  id: number;
  uploadDate: number;
  graduationYear: number;
  event: string;
  location: string;
  people: string[];
  imageData: string;
  author: number;
}

function formatPhotoDate(photos: PhotoResponse[]) {
  return photos.map((item) => ({
    ...item,
    uploadDate: new Date(item.uploadDate * 1000)
  }));
}

// BACKEND SHOULD CREATE ENDPOINT THAT EXCLUDES PHOTOS WITH CERTAIN IDS FROM THE RESPONSE --> LIKE THIS: /photos?excludeIds=1,2,3
// WHY? --> PHOTOS UPLOADED FROM CURRENT SESSION ARE SAVED LOCALLY, SO NO NEED TO FETCH
async function fetchPhotoData() {
  const { data, error } = await tryRequestEndpoint<PhotoResponse[]>("/photos");
  if (error) return error;
  let newPhotoArray = formatPhotoDate(data);
  if (user?.userType === "user") {
    newPhotoArray = newPhotoArray.filter((photo) => photo.author === user.id);
  } // this shouldn't be in frontend - filter by user with endpoint
  photoData.value.push(...newPhotoArray);
}

async function deletePhoto(photoIndex: number) {
  const confirmed = window.confirm("Are you sure you want to delete this photo?");
  if (!confirmed) return;
  photoData.value.splice(photoIndex, 1);
  //delete from api, call "/delete"
  /* const { data, error } = await tryRequestEndpoint(
    "/delete",
    "DELETE",
    {id: photoData.value[photoIndex].id}
  );
  if (error) return error; */
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

// filtering should be done on backend bc not all photos are fetched when page loads (will be deleted)
const filteredPhotoData = computed(() => {
  return photoData.value.filter((photo) => {
    const gradYearMatch = String(photo.graduationYear) === String(searchInputs.graduationYear) || searchInputs.graduationYear === "All";

    const uploadDateMatch =
      (photo.uploadDate.getFullYear() === Number(searchInputs.uploadDate.year) && months[photo.uploadDate.getMonth()] === searchInputs.uploadDate.month) ||
      (photo.uploadDate.getFullYear() === Number(searchInputs.uploadDate.year) && searchInputs.uploadDate.month === "All") ||
      (months[photo.uploadDate.getMonth()] === searchInputs.uploadDate.month && searchInputs.uploadDate.year === "All") ||
      (searchInputs.uploadDate.year === "All" && searchInputs.uploadDate.month === "All");
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
