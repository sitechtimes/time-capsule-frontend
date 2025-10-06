<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <img src="/menu-outline.svg" aria-hidden="true" class="h-5 w-5 dark:invert" draggable="false" />
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
          <li>
            <NuxtLink to="/" class="text-md font-semibold">Homepage</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/upload" class="text-md font-semibold">Upload</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <img v-if="store.theme === 'light'" src="/logo.svg" alt="logo" class="scale-85" />
      <img v-if="store.theme === 'dark'" src="/logodark.svg" alt="logo" class="scale-85" />
    </div>
    <div class="navbar-end">
      <button type="button" class="btn btn-ghost btn-circle">
        <label class="swap swap-rotate">
          <input type="checkbox" @change="toggle" />
          <img src="/sun.svg" aria-hidden="true" class="swap-off h-5 w-5" draggable="false" />
          <img src="/moon.svg" aria-hidden="true" class="swap-on h-5 w-5" draggable="false" />
        </label>
      </button>
      <button type="button" class="btn btn-ghost btn-circle">
        <div class="indicator">
          <img src="/notify.svg" aria-hidden="true" class="h-5 w-5" draggable="false" />
          <span class="badge badge-xs badge-primary indicator-item"></span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useUserStore();

function toggle() {
  store.theme = store.theme === "light" ? "dark" : "light";
}
</script>

<style scoped></style>
