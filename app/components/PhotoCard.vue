<template>
  <div class="card card-side bg-base-100 shadow-sm w-[30%] m-8">
    <figure>
      <img :src="photoData.imageData" aria-hidden="true" class="" />
    </figure>
    <div class="card-body">
      <p>
        Upload Date: {{ photoData.uploadDate }} <br />
        Graduation Year: {{ photoData.graduationYear }} <br />
        Event: {{ photoData.event }} <br />
        Location: {{ photoData.location }} <br />
        People:
        <span v-for="(person, index) in photoData.people" :key="index">
          {{ person }}<span v-if="index < photoData.people.length - 1">, </span>
        </span>
        <br />
        Author: {{ photoData.author }}
      </p>
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
