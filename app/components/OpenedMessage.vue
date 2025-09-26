<template>
  <div>
    <p>{{ message }}</p>
    <!-- photos - have approve& report for each, or maybe they are automatically approved unless reported -->
    <button class="btn">approve all</button>
    <button class="btn">report all</button>
    <button class="btn" @click="$emit('close')">close</button>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
