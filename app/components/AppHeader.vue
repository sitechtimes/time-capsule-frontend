<template>
  <div class="bg-accent">
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
  </div>
</template>

<script setup lang="ts">
const store = useUserStore();

function toggle() {
  store.theme = store.theme === "light" ? "dark" : "light";
}
</script>

<style scoped></style>
