<template>
  <dialog ref="modalRef" class="modal h-[80%] w-[70%]">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
          <img src="/close-outline.svg" aria-hidden="true" class="h-6 object-contain select-none dark:invert" draggable="false" />
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
  selectedPhoto: Photo | undefined;
}>();
const modalRef = useTemplateRef("modalRef");

function openModal() {
  modalRef.value?.showModal();
}

defineExpose({ openModal });
</script>
