<template>
  <div :data-theme="store.theme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const store = useUserStore();

onMounted(() => {
  if (!store.user) {
    void router.push("/login");
  }
});
</script>
