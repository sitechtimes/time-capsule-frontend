<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
          <img src="/close-outline.svg" aria-hidden="true" class="h-6 select-none dark:invert" draggable="false" />
        </button>
      </form>
      <img :src="selectedPhoto?.imageData" aria-hidden="true" class="mx-auto min-h-[70vh] w-auto object-contain" />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
defineProps<{
  selectedPhoto: Photo;
}>();
const modalRef = useTemplateRef("modalRef");
</script>
