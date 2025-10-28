<template>
  <div>
    <p>{{ name }}</p>
    <!-- have approve& report for each, or automatically approved unless reported? -->
    <PhotoCard v-for="photo in photos" :photo-data="photo" />
    <button class="btn">approve all</button>
    <button class="btn">report all</button>
    <button class="btn" @click="$emit('close')">close</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  photos: Photo[];
}>();

function approve() {}

function reportAll() {}
</script>

<style scoped></style>
