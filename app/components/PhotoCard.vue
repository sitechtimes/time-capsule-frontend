<template>
  <div class="card card-side bg-base-100 shadow-sm w-[26%] m-8">
    <img
      :src="photoData.imageData"
      aria-hidden="true"
      class="object-contain w-full h-auto"
    />

    <div class="dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        class="btn btn-circle btn-ghost btn-xs text-info tooltip"
        data-tip="Info"
      >
        <img
          src="/info.svg"
          aria-hidden="true"
          class="h-4 opacity-50 select-none dark:invert"
          draggable="false"
        />
      </div>
      <div
        class="card card-sm dropdown-content bg-base-100 rounded-box z-1 w-64 shadow-sm"
      >
        <div class="card-body">
          <p>
            Upload Date: {{ photoData.uploadDate.toLocaleString() }} <br />
            Graduation Year: {{ photoData.graduationYear }} <br />
            Event: {{ photoData.event }} <br />
            Location: {{ photoData.location }} <br />
            People: {{ photoData.people.join(", ") }}
            <br />
            Author: {{ photoData.author }}
          </p>
        </div>
      </div>

      <div class="card-actions justify-end tooltip" data-tip="Delete">
        <img
          src="/trash-outline.svg"
          aria-hidden="true"
          class="h-4 opacity-50 select-none btn btn-circle btn-ghost btn-xs dark:invert"
          draggable="false"
          @click="emit('delete')"
        />
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
}>();
</script>

<style scoped></style>
