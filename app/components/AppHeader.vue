<template>
  <div>
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
  if (store.theme === "dark") {
    store.theme = "light";
  } else {
    store.theme = "dark";
  }
}
</script>

<style scoped></style>
