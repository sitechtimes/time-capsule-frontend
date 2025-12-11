<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box mx-auto h-[80%] w-[60%] max-w-[60%]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 m-3">
          <img src="/close-outline.svg" aria-hidden="true" class="h-6 object-contain select-none dark:invert" draggable="false" />
        </button>
      </form>

      <div class="flex flex-col items-center">
        <img :src="selectedPhoto?.imageData" aria-hidden="true" class="m-4 mx-auto h-[60vh] w-auto object-contain" />

        <div class="mb-2 flex gap-2">
          <div class="badge badge-soft badge-event">{{ selectedPhoto?.event }}</div>
          <div class="badge badge-soft badge-location">{{ selectedPhoto?.location }}</div>
        </div>

        <p class="text-center">Graduation Year: {{ selectedPhoto?.graduationYear }}</p>
        <p class="text-center">People: {{ selectedPhoto?.people.join(", ") }}</p>
      </div>
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
