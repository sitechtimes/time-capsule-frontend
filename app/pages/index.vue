<template>
  <div class="flex min-h-screen">
    <SideBar v-model:search-inputs="searchInputs" />

    <div id="card-container" class="flex flex-row flex-wrap w-full">
      <PhotoCard
        v-for="(photo, index) in filteredPhotoData"
        :key="photo.id"
        :photoData="photo"
        @delete="deletePhoto(index)"
        @clicked="openModal(photo)"
      />
      <!-- put dialog here -->
      <dialog ref="modalRef" class="modal">
        <div class="modal-box">
          <form method="dialog">
            <button
              class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              <img
                src="/close-outline.svg"
                aria-hidden="true"
                class="h-6 dark:invert select-none"
                draggable="false"
              />
            </button>
          </form>
          <img
            :src="selectedPhoto?.imageData"
            aria-hidden="true"
            class="min-h-[70vh] w-auto mx-auto object-contain"
          />
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

// for modal
const modalRef = ref<HTMLDialogElement | null>(null);
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
} //can't use Photo bc uploadDate is Date type
async function fetchPhotoData() {
  const { data, error } = await tryRequestEndpoint<PhotoResponse[]>("/photos");
  if (error) return error;
  let newPhotoArray: Photo[] = data.map((item) => ({
    ...item,
    uploadDate: new Date(item.uploadDate * 1000),
  })); //newPhotoArray is data with changed date format
  if (user?.userType === "user") {
    newPhotoArray = newPhotoArray.filter((photo) => photo.author === user.id);
  } // this shouldn't be in frontend - have to be filtered using endpoints?
  photoData.value = newPhotoArray;
}

fetchPhotoData();

async function deletePhoto(photoIndex: number) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this photo?"
  );
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
    year: "All",
  }),
  graduationYear: "All",
  event: "All",
  location: "All",
  people: ref<string[]>([]),
});

// should be done on backend bc not all photos are fetched
const filteredPhotoData = computed(() => {
  return photoData.value.filter((photo) => {
    const gradYearMatch =
      String(photo.graduationYear) === String(searchInputs.graduationYear) ||
      searchInputs.graduationYear === "All";

    const uploadDateMatch = // fix this?
      (photo.uploadDate.getFullYear() ===
        Number(searchInputs.uploadDate.year) &&
        months[photo.uploadDate.getMonth()] ===
          searchInputs.uploadDate.month) ||
      (photo.uploadDate.getFullYear() ===
        Number(searchInputs.uploadDate.year) &&
        searchInputs.uploadDate.month === "All") ||
      (months[photo.uploadDate.getMonth()] === searchInputs.uploadDate.month &&
        searchInputs.uploadDate.year === "All") ||
      (searchInputs.uploadDate.year === "All" &&
        searchInputs.uploadDate.month === "All");

    const eventMatch =
      photo.event.toLowerCase().includes(searchInputs.event.toLowerCase()) ||
      searchInputs.event === "All";

    const locationMatch =
      photo.location
        .toLowerCase()
        .includes(searchInputs.location.toLowerCase()) ||
      searchInputs.location === "All";

    const peopleMatch =
      searchInputs.people.every((person) => photo.people.includes(person)) ||
      searchInputs.people.length === 0; //check case too

    return (
      gradYearMatch &&
      uploadDateMatch &&
      eventMatch &&
      locationMatch &&
      peopleMatch
    );
  });
});
</script>

<style scoped></style>
