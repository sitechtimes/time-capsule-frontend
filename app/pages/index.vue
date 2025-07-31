<template>
  <div>
    <div class="flex flex-row" id="card-container">
      <PhotoCard v-for="photo in photoData" :cardData="photo" :key="photo.id" />
    </div>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
const photoData = ref<Photo[]>([]);
const errorMessage = ref();
async function fetchPhotoData() {
  try {
    const { data, error } = await useFetch("/api/photos");
    if (data.value) {
      photoData.value = data.value;
    }
    console.log(photoData.value);
  } catch (error: unknown) {
    errorMessage.value = error;
  }

  //return
}
fetchPhotoData;

// chatgpt says: useAsyncData runs on both server and client and supports caching, loading states, and revalidation.
// const { data: photoData, error } = await useAsyncData<Photo[]>("photoData",() => $fetch("/api/photos"));
</script>

<style scoped></style>
