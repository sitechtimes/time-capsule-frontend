<template>
  <div class="flex flex-row">
    <!-- messages -->
    <div class="">
      <InboxMessage name="test" :photo-count="0" time="test" @clicked="messageOpened = true" />
    </div>
    <!-- opened message, only show if a messsage is clicked on -->
    <div v-if="!messageOpened">click on a message to open it</div>
    <OpenedMessage v-else @close="messageOpened = false" />
  </div>
</template>

<script setup lang="ts">
const messageOpened = ref(false);
</script>

<style scoped></style>
