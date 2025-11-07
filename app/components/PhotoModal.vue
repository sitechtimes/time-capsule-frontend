<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box mx-auto h-[80%] w-[60%] max-w-[60%]">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">
          <img src="/close-outline.svg" aria-hidden="true" class="h-6 object-contain select-none dark:invert" draggable="false" />
        </button>
      </form>
      <img :src="selectedPhoto?.imageData" aria-hidden="true" class="mx-auto max-h-[70vh] min-h-[70vh] w-auto object-contain" />
      <p>Graduation Year: {{ selectedPhoto?.graduationYear }} <br /></p>
      <div>
        <div class="badge badge-soft badge-event">{{ selectedPhoto?.event }}</div>
        <div class="badge badge-soft badge-location">{{ selectedPhoto?.location }}</div>
      </div>
      <p>People: {{ selectedPhoto?.people.join(", ") }}</p>
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
