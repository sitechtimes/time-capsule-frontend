<template>
  <div :data-theme="store.theme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const store = useUserStore();
</script>
