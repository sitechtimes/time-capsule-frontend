<template>
  <div :data-theme="store.theme">
    <AppHeader />
    <NuxtPage />
  </main>
</template>

<script setup lang="ts">
const store = useUserStore();
</script>
