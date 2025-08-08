<template>
  <div class="flex h-screen overflow-hidden">
    <div
      class="bg-base-200 w-64 p-4 left-0 space-y-4 fixed h-full z-30 transition-transform duration-300 ease-in-out"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">Filters</h2>
      </div>
      <ul class="menu">
        <slot name="side"></slot>
      </ul>
    </div>

    <div
      class="flex-1 transition-all duration-300 ease-in-out p-6"
      :class="sidebarOpen ? 'ml-64' : 'ml-0'"
    >
      <div class="flex items-center justify-between mb-4">
        <button
          class="btn btn-square btn-ghost"
          @click="sidebarOpen = !sidebarOpen"
        >
          <img
            v-if="sidebarOpen === true"
            src="/close-outline.svg"
            aria-hidden="true"
            draggable="false"
            class="select-none dark:invert"
          />
          <img
            v-else
            src="/menu-outline.svg"
            aria-hidden="true"
            draggable="false"
            class="select-none dark:invert"
          />
        </button>
      </div>

      <!-- page content -->
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(true);
</script>
