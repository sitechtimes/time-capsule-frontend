<template>
  <div>
    <div>
      <!-- <form action=""></form>       combine inputs-->
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
        />
      </label>

      <label class="input">
        <!-- upload date range? -->
        <select v-model="uploadDateInput.year" name="" id="">
          <option value="all">All</option>
          <option v-for="year in [2025]" :key="year" :value="year">
            <!-- idk bro  -->
            {{ year }}
          </option>
        </select>
        <select v-model="uploadDateInput.month" name="" id="">
          <option value="all">All</option>
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
        <input v-model="eventInput" type="text" placeholder="Event" />
      </label>

      <label class="input">
        <img
          src="/search.svg"
          aria-hidden="true"
          class="h-4 opacity-50 dark:invert select-none"
          draggable="false"
        />
        <input v-model="locationInput" type="text" placeholder="Location" />
      </label>

      <label class="input">
        <img
          src="/search.svg"
          aria-hidden="true"
          class="h-4 opacity-50 dark:invert select-none"
          draggable="false"
        />
        <input
          v-model="peopleInput"
          type="text"
          placeholder="People (comma-separated)"
          @change="searchByPeople(peopleInput)"
        />
      </label>
      <button class="btn" @click="resetInputs">Reset</button>
    </div>

    <div id="card-container" class="flex flex-row flex-wrap">
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
// filter by date, year; search by event, location?, people(multiple), author
const photoData = ref<Photo[]>([]);
//const filteredPhotoData = ref<Photo[]>([]);
const errorMessage = ref();
const graduationYearInput = ref("");
const uploadDateInput = ref({
  month: "all",
  year: "all",
});
const eventInput = ref("");
const locationInput = ref("");
const peopleInput = ref("test");

const user = useUserStore().user;

async function fetchPhotoData() {
  try {
    const { data } = await useFetch("/api/photos");
    if (data.value) {
      let newPhotoArray: Photo[] = data.value.map((item) => ({
        ...item,
        uploadDate: new Date(item.uploadDate * 1000),
      })); //newPhotoArray is data with changed date format
      if (user?.userType === "user") {
        newPhotoArray = newPhotoArray.filter(
          (photo) => photo.author === user.id
        );
      }
      photoData.value = newPhotoArray;
      //filteredPhotoData.value = newPhotoArray;
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

function resetInputs() {
  graduationYearInput.value = "";
  uploadDateInput.value = {
    month: "all",
    year: "all",
  };
  eventInput.value = "";
  //filteredPhotoData.value = photoData.value;
}

const filteredPhotoData = computed(() => {
  return photoData.value.filter((photo) => {
    const gradYearMatch =
      String(photo.graduationYear).includes(graduationYearInput.value) ||
      graduationYearInput.value === "";

    const uploadDateMatch = // fix this
      (photo.uploadDate.getFullYear() === Number(uploadDateInput.value.year) &&
        photo.uploadDate.getMonth() + 1 ===
          Number(uploadDateInput.value.month)) ||
      photo.uploadDate.getFullYear() === Number(uploadDateInput.value.year) ||
      photo.uploadDate.getMonth() + 1 === Number(uploadDateInput.value.month) ||
      (uploadDateInput.value.year === "all" &&
        uploadDateInput.value.month === "all");

    const eventMatch =
      photo.event.toLowerCase().includes(eventInput.value.toLowerCase()) ||
      eventInput.value === "";

    const locationMatch =
      photo.location
        .toLowerCase()
        .includes(locationInput.value.toLowerCase()) ||
      locationInput.value === "";

    return gradYearMatch && uploadDateMatch && eventMatch && locationMatch;
  });
});

/* function searchByGradYear(input: string) {
  if (input === "") {
    filteredPhotoData.value = photoData.value;
  }
  filteredPhotoData.value = photoData.value.filter((photo) =>
    String(photo.graduationYear).includes(input)
  );
}

function searchByUploadDate(input: object) {
  if (input.year === "all" && input.month === "all") {
    filteredPhotoData.value = photoData.value;
  } else if (input.year === "all") {
    filteredPhotoData.value = photoData.value.filter(
      (photo) => photo.uploadDate.getMonth() + 1 === input.month
    );
  } else if (input.month === "all") {
    filteredPhotoData.value = photoData.value.filter(
      (photo) => photo.uploadDate.getFullYear() === input.year
    );
  } else {
    filteredPhotoData.value = photoData.value.filter(
      (photo) =>
        photo.uploadDate.getFullYear() === input.year &&
        photo.uploadDate.getMonth() + 1 === input.month
    );
  }
}

function searchByEvent(input: string) {
  filteredPhotoData.value = photoData.value.filter((photo) =>
    photo.event.toLowerCase().includes(input.toLowerCase())
  );
}

function searchByLocation(input: string) {
  filteredPhotoData.value = photoData.value.filter((photo) =>
    photo.location.toLowerCase().includes(input.toLowerCase())
  );
} */

function searchByPeople(input: string) {
  const inputArray = input.split(", ");
  console.log(inputArray);
  // check if all ppl in inputArray (ppl input) are in photoData.value.people; filteredPhotoData is every photo that does have all ppl
  photoData.value.forEach((photo) => {
    const peopleIncluded = inputArray.every((person) =>
      photo.people.includes(person)
    );
    if (peopleIncluded) filteredPhotoData.value.push(photo);
  });
}
</script>

<style scoped></style>
