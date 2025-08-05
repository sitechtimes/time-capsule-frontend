<template>
  <div class="card card-side bg-base-100 shadow-sm w-100 m-8">
    <figure>
      <img :src="photoData.imageData" aria-hidden="true" class="" />
    </figure>
    <div class="card-body">
      <p>{{ photoData.event }}</p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary" @click="deleteCard">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  photoData: Photo; //have to convert upload date
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
