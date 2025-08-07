<template>
  <div class="bg-primary">
    <label class="swap swap-rotate">
      <input type="checkbox" @change="toggle" />
      <img
        src="/sun.svg"
        aria-hidden="true"
        class="swap-off h-10 w-10 fill-current select-none"
        draggable="false"
      />
      <img
        src="/moon.svg"
        aria-hidden="true"
        class="swap-on h-10 w-10 fill-current select-none"
        draggable="false"
      />
    </label>
    <!-- <NuxtLink to="/" v-if="store.user">
      <img
        src="/home.svg"
        aria-hidden="true"
        draggable="false"
        class="h-10 w-10"
      />
    </NuxtLink> -->
  </div>
</template>

<script setup lang="ts">
const store = useUserStore();

function toggle() {
  store.theme = store.theme === "light" ? "dark" : "light";
}
</script>

<style scoped></style>
