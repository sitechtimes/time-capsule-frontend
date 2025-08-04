<template>
  <div :data-theme="store.theme">
    <AppHeader />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const store = useUserStore();
</script>
