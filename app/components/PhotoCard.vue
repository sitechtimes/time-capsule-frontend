<template>
  <div class="card">
    <div id=""></div>
    <h2>{{ photoData.uploadDate }}</h2>
    <button class="btn" @click="deleteCard">Delete</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  photoData: Photo;
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
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  delete: [void];
}>();

function deleteCard() {
  emit("delete");
}
</script>

<style scoped></style>
