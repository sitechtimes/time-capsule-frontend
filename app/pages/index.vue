<template>
  <div>
    <div>
      <!-- <form action=""></form> -->
      <label class="input">
        <img
          src="/search.svg"
          aria-hidden="true"
          class="h-4 opacity-50 dark:invert select-none"
          draggable="false"
        />
        <input
          v-model="graduationYearInput"
          type="number"
          placeholder="Graduation Year"
          @change="searchByGradYear(graduationYearInput)"
        />
        <!-- search bar and filters -->
      </label>
      <label class="input" @change="searchByUploadDate(uploadDateInput)">
        <!-- upload date range? -->
        <select v-model="uploadDateInput.year" name="" id="">
          <option v-for="year in [2025]" :key="year" :value="year">
            <!-- idk bro  -->
            {{ year }}
          </option>
        </select>
        <select v-model="uploadDateInput.month" name="" id="">
          <option v-for="month in 12" :key="month" :value="month">
            {{ month }}
          </option>
        </select>
      </label>
      <label class="input">
        <img
          src="/search.svg"
          aria-hidden="true"
          class="h-4 opacity-50 dark:invert select-none"
          draggable="false"
        />
        <input
          v-model="eventInput"
          type="text"
          placeholder="Event"
          @change="searchByEvent(eventInput)"
        />
      </label>
    </div>

    <div id="card-container" class="flex flex-row">
      <PhotoCard
        v-for="(photo, index) in filteredPhotoData"
        :key="photo.id"
        :photoData="photo"
        @delete="deletePhoto(index)"
      />
    </div>
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
// filter by date, year; search by event, location?, people, author
const photoData = ref<Photo[]>([]);
const filteredPhotoData = ref<Photo[]>([]);
const errorMessage = ref();
const graduationYearInput = ref("");
const uploadDateInput = ref({
  month: "",
  year: "",
});
const eventInput = ref("");
async function fetchPhotoData() {
  try {
    const { data } = await useFetch("/api/photos");
    if (data.value) {
      const newPhotoArray: Photo[] = data.value.map((item) => ({
        ...item,
        uploadDate: new Date(item.uploadDate * 1000),
      }));
      photoData.value = newPhotoArray;
      filteredPhotoData.value = newPhotoArray;
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

function searchByGradYear(input) {
  if (input === "") {
    filteredPhotoData.value = photoData.value;
  }
  filteredPhotoData.value = photoData.value.filter(
    (photo) => photo.graduationYear === Number(input)
  );
}

function searchByUploadDate(input) {
  filteredPhotoData.value = photoData.value.filter(
    (photo) =>
      photo.uploadDate.getFullYear() === input.year &&
      photo.uploadDate.getMonth() + 1 === input.month
  );
}

function searchByEvent(input) {
  filteredPhotoData.value = photoData.value.filter((photo) =>
    photo.event.toLowerCase().includes(input.toLowerCase())
  );
}
</script>

<style scoped></style>
