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
          v-model="searchInputs.graduationYear"
          type="number"
          placeholder="Graduation Year"
        />
      </label>

      <label class="input">
        <!-- upload date range? -->
        <select v-model="searchInputs.uploadDate.year" name="" id="">
          <option value="all">All</option>
          <option
            v-for="year in getYears(2025, 2050)"
            :key="year"
            :value="year"
          >
            {{ year }}
          </option>
        </select>
        <select v-model="searchInputs.uploadDate.month" name="" id="">
          <option value="all">All</option>
          <option
            v-for="(month, index) in months"
            :key="month"
            :value="index + 1"
          >
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
        <input v-model="searchInputs.event" type="text" placeholder="Event" />
      </label>

      <label class="input">
        <img
          src="/search.svg"
          aria-hidden="true"
          class="h-4 opacity-50 dark:invert select-none"
          draggable="false"
        />
        <input
          v-model="searchInputs.location"
          type="text"
          placeholder="Location"
        />
      </label>

      <div>
        <label for="people" class="block mb-1">People (comma-separated):</label>
        <input
          v-model="personInput"
          type="text"
          placeholder="Ex: John Doe, ..."
          class="input w-full bg-base-100"
          @input="handlePeopleInput"
        />
      </div>
      <div class="flex flex-wrap gap-2 mt-2">
        <div
          v-for="(person, index) in searchInputs.people"
          :key="index"
          class="rounded-full bg-neutral-200 px-3 py-1 flex items-center gap-2"
        >
          <span class="text-black">{{ person }}</span>
          <button type="button" @click="removePerson(index)">✕</button>
        </div>
      </div>

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
//endpoint for events+locations - so user can select existing events instead of inputting own; cards for people

// filter by date, year; search by event, location?, people(multiple), author
const photoData = ref<Photo[]>([]);
//const filteredPhotoData = ref<Photo[]>([]);
const errorMessage = ref();
const searchInputs = reactive({
  uploadDate: ref({
    month: "all",
    year: "all",
  }),
  graduationYear: new Date().getFullYear(),
  event: "",
  location: "",
  people: ref<string[]>([]),
});

const personInput = ref(""); //change name later?
function removePerson(index: number) {
  searchInputs.people.splice(index, 1);
}
function handlePeopleInput() {
  const name = personInput.value;
  if (name.endsWith(",")) {
    const trimmedName = name.slice(0, -1).trim();
    if (trimmedName && !searchInputs.people.includes(trimmedName)) {
      searchInputs.people.push(trimmedName);
    }
    personInput.value = "";
  }
}

const user = useUserStore().user;
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
function getYears(min: number, max: number) {
  const yearArray: number[] = [];
  for (let i = min; i <= max; i++) {
    yearArray.push(i);
  }
  return yearArray;
}

async function fetchPhotoData() {
  try {
    const { data } = await useFetch("/api/photos"); //use tryRequestEndpoint
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
  searchInputs.uploadDate = {
    month: "all",
    year: "all",
  };
  searchInputs.graduationYear = new Date().getFullYear();
  searchInputs.event = "";
  searchInputs.location = "";
  searchInputs.people = [];
  //filteredPhotoData.value = photoData.value;
}

const filteredPhotoData = computed(() => {
  return photoData.value.filter((photo) => {
    const gradYearMatch =
      String(photo.graduationYear).includes(
        String(searchInputs.graduationYear)
      ) || searchInputs.graduationYear === new Date().getFullYear();

    const uploadDateMatch = // fix this
      (photo.uploadDate.getFullYear() ===
        Number(searchInputs.uploadDate.year) &&
        photo.uploadDate.getMonth() + 1 ===
          Number(searchInputs.uploadDate.month)) ||
      (photo.uploadDate.getFullYear() ===
        Number(searchInputs.uploadDate.year) &&
        searchInputs.uploadDate.month === "all") ||
      (photo.uploadDate.getMonth() + 1 ===
        Number(searchInputs.uploadDate.month) &&
        searchInputs.uploadDate.year === "all") ||
      (searchInputs.uploadDate.year === "all" &&
        searchInputs.uploadDate.month === "all");

    const eventMatch =
      photo.event.toLowerCase().includes(searchInputs.event.toLowerCase()) ||
      searchInputs.event === "";

    const locationMatch =
      photo.location
        .toLowerCase()
        .includes(searchInputs.location.toLowerCase()) ||
      searchInputs.location === "";

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

function searchByPeople(input: string[]) {
  console.log(input);
  // check if all ppl in input (ppl input) are in photoData.value.people for each photo; filteredPhotoData is every photo that does have all ppl
  photoData.value.forEach((photo) => {
    const peopleIncluded = input.every((person) =>
      photo.people.includes(person)
    );
    if (peopleIncluded) filteredPhotoData.value.push(photo);
  });
}
</script>

<style scoped></style>
