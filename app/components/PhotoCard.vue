<template>
  <div class="card card-side bg-base-100 relative m-4 h-[380px] w-full shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-lg sm:w-[48%] md:w-[30%] lg:w-[26%] xl:w-[21%]">
    <div class="flex h-full w-full flex-col">
      <div class="bg-base-200 flex flex-grow items-center justify-center overflow-hidden rounded-t-xl">
        <img
          :src="photoData.imageData"
          aria-hidden="true"
          class="h-full max-h-[300px] w-full cursor-pointer object-contain transition-transform duration-300 hover:scale-105"
          @click="emit('clicked')"
        />
      </div>
      <div class="buttons w-full content-center items-center text-center">
        <div class="border-base-300 bg-base-200 flex items-center justify-center rounded-b-xl border-t py-2 text-center">
          <div class="dropdown dropdown-top">
            <label tabindex="0" class="btn btn-circle btn-ghost btn-sm tooltip" data-tip="Info">
              <img src="/information-circle-outline.svg" aria-hidden="true" class="h-5 opacity-60 dark:invert" draggable="false" />
            </label>
            <div tabindex="0" class="card card-sm dropdown-content bg-base-100 rounded-box z-50 w-64 shadow-sm">
              <div class="card-body">
                <p>
                  Upload Date: {{ photoData.uploadDate.toLocaleString() }} <br />
                  Graduation Year: {{ photoData.graduationYear }} <br />
                  People: {{ photoData.people.join(", ") }}
                  <br />
                  Author: {{ photoData.author }}
                </p>
                <div>
                  <div class="badge badge-soft badge-event badge-sm m-1">{{ photoData.event }}</div>
                  <div class="badge badge-soft badge-sm m-1 inline-flex items-center px-2 py-1">{{ photoData.location }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="tooltip" data-tip="Download">
            <button class="btn btn-circle btn-ghost btn-sm content-center text-center" @click="download(photoData)">
              <img src="/download-outline.svg" aria-hidden="true" class="h-5 opacity-60 dark:invert" draggable="false" />
            </button>
          </div>

          <div class="tooltip" data-tip="Delete">
            <button class="btn btn-circle btn-ghost btn-sm content-center text-center" @click="emit('delete')">
              <img src="/trash-outline.svg" aria-hidden="true" class="h-5 opacity-60 select-none dark:invert" draggable="false" />
            </button>
          </div>

          <div class="tooltip" data-tip="Edit">
            <button class="btn btn-circle btn-ghost btn-sm content-center text-center">
              <img src="/edit.svg" aria-hidden="true" class="h-5 opacity-60 select-none dark:invert" draggable="false" />
            </button>
          </div>
          <div class="card-actions tooltip justify-end text-center" data-tip="Delete">
            <!-- only show if logged in user is student & author -->
            <img
              v-if="`${store.user?.firstName} ${store.user?.lastName}` === photoData.author"
              src="/trash-outline.svg"
              aria-hidden="true"
              class="btn btn-circle btn-ghost btn-s h-4 opacity-50 select-none dark:invert"
              draggable="false"
              @click="emit('delete')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useUserStore();

defineProps<{
  photoData: Photo;
}>();

const emit = defineEmits<{
  delete: [void];
  clicked: [void];
}>();

const download = async (photoData: Photo) => {
  try {
    const base64Data = photoData.imageData;
    const fileName = `${photoData.event} at ${photoData.location} - Uploaded ${photoData.uploadDate.toLocaleString()}`;
    const res = await fetch(base64Data);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download image:", error);
  }
};
</script>

<style scoped>
.modal::backdrop,
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
