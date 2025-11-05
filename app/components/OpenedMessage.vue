<template>
  <div>
    <p>{{ name }} uploaded {{ photos.length }} photos at [time] on [date]</p>
    <!-- have approve& report for each, or automatically approved unless reported? -->
    <p>{{ photos.length }} uploads:</p>
    <div class="flex flex-row"><MessagePhoto v-for="photo in photos" :photo-data="photo" @clicked="openModal(photo)" @approve="approve([photo])" @report="report([photo])" /></div>

    <div>
      <button class="btn" @click="approve(photos)">Approve All</button>
      <button class="btn" @click="report(photos)">Report All</button>
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

function approve(photos: Photo[]) {
  if (photos.length === 1) {
    const photo = photos[0];
    //backend stuff
    //photo now shown in /photos and admin main page
    //remove "pending" label from user main page - notifies user
  } else {
    //backend stuff
    //same as for one photo, but w/ photos.forEach
  }
}

function report(photos: Photo[]) {
  if (photos.length === 1) {
    const photo = photos[0];
    //backend stuff
    // photo deleted?
    // notifies user
    // add smth to keep count of user's # of reported photos
  } else {
    // same thing but for array
  }
}

const selectedPhoto = ref<Photo>();
const modalRef = useTemplateRef("modalRef");
function openModal(selectedPhotoData: Photo) {
  selectedPhoto.value = selectedPhotoData;
  modalRef.value?.openModal();
}
</script>

<style scoped></style>
