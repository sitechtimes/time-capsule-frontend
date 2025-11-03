<template>
  <div class="card card-side bg-base-100 m-4 h-[40%] w-full shadow-sm sm:w-[48%] md:w-[30%] lg:w-[26%] xl:w-[21%]">
    <img :src="photoData.imageData" aria-hidden="true" class="btn h-auto w-full cursor-pointer object-contain" @click="emit('clicked')" />

    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-circle btn-ghost btn-s text-info tooltip" data-tip="Info">
        <img src="/info.svg" aria-hidden="true" class="h-4 opacity-50 select-none dark:invert" draggable="false" />
      </div>
      <div class="card card-sm dropdown-content bg-base-100 rounded-box z-1 w-64 shadow-sm">
        <div class="card-body">
          <p>
            Upload Date: {{ photoData.uploadDate.toLocaleString() }} <br />
            Graduation Year: {{ photoData.graduationYear }} <br />
            Location: {{ photoData.location }} <br />
            People: {{ photoData.people.join(", ") }}
            <br />
            Author: {{ photoData.author }}
          </p>
          <div>
            <div class="badge badge-soft badge-primary">{{ photoData.event }}</div>
            <div class="badge badge-soft badge-secondary">{{ photoData.location }}</div>
          </div>
        </div>
      </div>

      <div class="card-actions tooltip justify-end" data-tip="Delete">
        <img src="/trash-outline.svg" aria-hidden="true" class="btn btn-circle btn-ghost btn-s h-4 opacity-50 select-none dark:invert" draggable="false" @click="emit('delete')" />
      </div>
      <div class="card-actions tooltip justify-end" data-tip="Download">
        <img src="/download-outline.svg" aria-hidden="true" class="btn btn-circle btn-ghost btn-s h-4 opacity-50 select-none dark:invert" draggable="false" @click="download(photoData)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  photoData: Photo;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
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

<style scoped></style>
