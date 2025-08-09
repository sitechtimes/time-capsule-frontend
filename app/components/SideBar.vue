<template>
  <aside
    :class="[isCollapsed ? 'w-12' : 'w-64']"
    class="bg-base-200 min-h-screen transition-all duration-300 relative"
  >
    <!-- aside tells browser that this is supporting content, not the main page body; used for sidebars, ads, nav menus, etc. -->
    <!-- Toggle Button (always visible) -->
    <button
      class="btn btn-sm btn-circle absolute top-4 right-[-0.75rem] z-10"
      @click="isCollapsed = !isCollapsed"
    >
      <img
        v-if="!isCollapsed"
        src="/arrow-back-outline.svg"
        aria-hidden="true"
        draggable="false"
        class="dark:invert select-none"
      />
      <img
        v-else
        src="/arrow-forward-outline.svg"
        aria-hidden="true"
        draggable="false"
        class="dark:invert select-none"
      />
    </button>

    <!-- Content (only when expanded) -->
    <div v-if="!isCollapsed" class="p-4">
      <h2 class="text-xl font-bold mb-6">Filters</h2>

      <!-- sidebar content -->
      <slot></slot>
    </div>
  </aside>
</template>

<script setup lang="ts">
const isCollapsed = ref(false);
</script>
