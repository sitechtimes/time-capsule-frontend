<template>
  <div>
    <div>
      <label class="input">
        <img
          src="/search.svg"
          aria-hidden="true"
          class="h-4 opacity-50 dark:invert select-none"
          draggable="false"
        />
        <input
          v-model="searchInput"
          type="search"
          placeholder="Search"
          required
          @change="search(searchInput)"
        />
        <!-- search bar or filters? -->
      </label>
    </div>

    <div id="card-container" class="flex flex-row">
      <PhotoCard
        v-for="(photo, index) in photoData"
        :key="photo.id"
        :photoData="photo"
        @delete="deletePhoto(index)"
      />
    </div>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
const photoData = ref<Photo[]>([]);
const errorMessage = ref();
const searchInput = ref<string>("");
async function fetchPhotoData() {
  try {
    const { data } = await useFetch("/api/photos");
    if (data.value) {
      photoData.value = data.value;
    }
  } catch (error: unknown) {
    errorMessage.value = error;
  }
  //return ?
}
fetchPhotoData();

async function deletePhoto(photoIndex: number) {
  photoData.value.splice(photoIndex, 1);
  /* try {
    await $fetch(`/api/items/${photoIndex}`, {
      method: "DELETE",
      });
    console.log("item deleted");
  } catch (error) {
    console.error("Error deleting item:", error);
  } */
}

function search(input: string) {
  //photoData.value.filter((photo)=>)
}
</script>

<style scoped></style>
