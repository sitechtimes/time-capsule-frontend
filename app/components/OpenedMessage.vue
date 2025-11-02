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
    <PhotoModal ref="modalRef" :selected-photo="selectedPhoto" />
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
  modalRef.value?.openModal();
}
</script>

<style scoped></style>
