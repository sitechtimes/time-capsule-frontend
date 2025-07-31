<template>
  <div class="">
    <div id="image"></div>
    <h2>{{ cardData.uploadDate }}</h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cardData: Photo;
}>();

/* export interface Photo {
  id: number;
  uploadDate: number;
  graduationYear: number;
  event: string;
  location: string;
  people: string[];
  imageData: string;
  author: User["id"];
} */
</script>

<style scoped></style>
