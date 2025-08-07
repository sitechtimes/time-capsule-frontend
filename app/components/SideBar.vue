<template>
  <div class="flex h-screen overflow-hidden">
    <div
      :class="[
        'bg-base-200 w-64 p-4 left-0 space-y-4 fixed h-full z-30 transition-transform duration-300 ease-in-out ',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold">Filters</h2>
        <button class="btn btn-sm btn-ghost" @click="toggleSidebar">✕</button>
      </div>
      <ul class="menu">
        <slot name="side"></slot>
      </ul>
    </div>

    <div
      :class="[
        'flex-1 transition-all duration-300 ease-in-out p-6',
        sidebarOpen ? 'ml-64' : 'ml-0',
      ]"
    >
      <div class="flex items-center justify-between mb-4">
        <button class="btn btn-square btn-ghost" @click="toggleSidebar">
          <svg
            v-if="!sidebarOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span v-else>☰</span>
        </button>
      </div>

      <!-- page content -->
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const sidebarOpen = ref(true);

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
</script>
