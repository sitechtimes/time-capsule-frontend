<template>
  <div>
    <p>{{ name }} uploaded {{ photos.length }} photos at [time] on [date]</p>
    <!-- have approve& report for each, or automatically approved unless reported? -->
    <p>{{ photos.length }} uploads:</p>
    <div class="flex flex-row"><MessagePhoto v-for="photo in photos" :photo-data="photo" @clicked="openModal(photo)" @approve="approveOne(photo)" @report="reportOne(photo)" /></div>

    <div>
      <button class="btn" @click="approveAll(photos)">Approve All</button>
      <button class="btn" @click="reportAll(photos)">Report All</button>
      <button class="btn" @click="$emit('close')">Close</button>
    </div>
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
        <button>Close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  photos: Photo[];
}>();

function approveOne(photo) {
  //backend stuff
  //photo now shown in /photos and admin main page
  //remove "pending" label from user main page - notifies user
}

function reportOne(photo) {
  //backend stuff
  // photo deleted?
  // notifies user
  // add smth to keep count of user's # of reported photos
}

function approveAll(photos) {
  // same as approveOne(photo) but for an array
}

function reportAll(photos) {
  // same as reportOne(photo) but for an array
}

const selectedPhoto = ref<Photo>();

const modalRef = useTemplateRef("modalRef");
function openModal(selectedPhotoData: Photo) {
  selectedPhoto.value = selectedPhotoData;
  modalRef.value?.showModal();
}
</script>

<style scoped></style>
