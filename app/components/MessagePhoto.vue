<template>
  <div class="card card-side bg-base-100 relative m-4 h-[300px] w-full shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-lg sm:w-[48%] md:w-[30%] lg:w-[26%] xl:w-[21%]">
    <div class="flex h-full w-full flex-col">
      <div class="bg-base-200 flex flex-grow items-center justify-center overflow-hidden rounded-t-xl">
        <img
          :src="photoData.imageData"
          aria-hidden="true"
          class="h-full max-h-[300px] w-full cursor-pointer object-contain transition-transform duration-300 hover:scale-105"
          @click="emit('clicked')"
        />
      </div>

      <div class="border-base-300 bg-base-200 flex items-center justify-around rounded-b-xl border-t py-2">
        <div class="dropdown dropdown-top">
          <label tabindex="0" class="btn btn-circle btn-ghost btn-sm tooltip" data-tip="Info">
            <img src="/information-circle-outline.svg" aria-hidden="true" class="h-5 opacity-60 dark:invert" draggable="false" />
          </label>
          <div tabindex="0" class="card card-sm dropdown-content bg-base-100 rounded-box z-50 w-64 shadow-sm">
            <div class="card-body text-sm">
              <p>
                Upload Date: {{ photoData.uploadDate.toLocaleString() }}<br />
                Graduation Year: {{ photoData.graduationYear }}<br />
                Event: {{ photoData.event }}<br />
                Location: {{ photoData.location }}<br />
                People: {{ photoData.people.join(", ") }}<br />
                Author: {{ photoData.author }}
              </p>
            </div>
          </div>
        </div>
        <div class="tooltip" data-tip="Approve Photo">
          <button class="btn btn-circle btn-ghost btn-sm" @click="emit('approve')">
            <img src="/checkmark-circle-outline.svg" aria-hidden="true" class="h-5 opacity-60 dark:invert" draggable="false" />
          </button>
        </div>
        <div class="tooltip" data-tip="Report Photo">
          <button class="btn btn-circle btn-ghost btn-sm" @click="emit('report')">
            <img src="/warning-outline.svg" aria-hidden="true" class="h-5 opacity-60 dark:invert" draggable="false" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  photoData: Photo;
}>();

const emit = defineEmits<{
  clicked: [void];
  approve: [void];
  report: [void];
}>();
</script>
