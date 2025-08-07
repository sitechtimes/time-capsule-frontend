<template>
  <div :data-theme="store.theme">
    <AppHeader />
    <SideBar>
      <NuxtPage />
    </SideBar>
  </div>
</template>

<script setup lang="ts">
const store = useUserStore();
</script>
