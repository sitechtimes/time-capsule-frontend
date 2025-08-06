<template>
  <div class="p-4 mx-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div>
        <label for="graduation-year" class="block mb-1 text-sm font-medium"
          >Graduation Year:</label
        >
        <input
          v-model="searchInputs.graduationYear"
          type="number"
          placeholder="Graduation Year"
          class="input w-full bg-transparent focus:outline-none"
        />
      </div>

      <div class="">
        <label for="upload-date" class="block mb-1 text-sm font-medium"
          >Upload Date:</label
        >
        <div>
          <label for="month" class="label block mb-1 text-sm">Month</label>
          <select
            v-model="searchInputs.uploadDate.month"
            class="w-1/2 bg-transparent focus:outline-none"
            name="month"
          >
            <option value="all">All</option>
            <option
              v-for="(month, index) in months"
              :key="month"
              :value="index + 1"
            >
              {{ month }}
            </option>
          </select>
        </div>
        <div>
          <label for="year" class="label block mb-1 text-sm">Year</label>
          <select
            v-model="searchInputs.uploadDate.year"
            class="w-1/2 bg-transparent focus:outline-none"
            name="year"
          >
            <option value="all">All</option>
            <option
              v-for="year in getYears(2024, 2050)"
              :key="year"
              :value="year"
            >
              {{ year }}
            </option>
          </select>
        </div>
      </div>

      <div>
        <label for="Events" class="block mb-1 text-sm font-medium"
          >Event:</label
        >
        <input
          v-model="searchInputs.event"
          type="text"
          placeholder="Event"
          class="input w-full bg-transparent focus:outline-none"
        />
      </div>

      <div class="">
        <label for="location" class="block mb-1 text-sm font-medium"
          >Location:</label
        >
        <input
          v-model="searchInputs.location"
          type="text"
          placeholder="Location"
          class="input w-full bg-transparent focus:outline-none"
        />
      </div>

      <div>
        <label for="people" class="block mb-1 text-sm font-medium"
          >People (comma-separated):</label
        >
        <input
          v-model="personInput"
          type="text"
          placeholder="Ex: John Doe, ..."
          class="input w-full bg-base-100"
          @input="handlePeopleInput"
        />
      </div>

      <div class="flex items-end">
        <button class="btn" @click="resetInputs">Reset</button>
      </div>
    </div>

    <div class="flex flex-wrap flex-row">
      <div v-for="(person, index) in searchInputs.people" :key="index">
        <span class="text-black">{{ person }}</span>
        <button type="button" @click="removePerson(index)">✕</button>
      </div>
    </div>

    <div id="card-container" class="flex flex-row flex-wrap gap-4">
      <PhotoCard
        v-for="(photo, index) in filteredPhotoData"
        :key="photo.id"
        :photoData="photo"
        @delete="deletePhoto(index)"
      />
    </div>

    <p class="mt-4">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
//endpoint for events+locations - so user can select existing events - change input to select&option
//should the photoResponse interface be here? what to do w endpoints - photo limits, events&locations, filtering by user
const photoData = ref<Photo[]>([]);
const errorMessage = ref();
const searchInputs = reactive({
  uploadDate: ref({
    month: "all",
    year: "all",
  }),
  graduationYear: "",
  event: "",
  location: "",
  people: ref<string[]>([]),
});

const personInput = ref("");
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

interface PhotoResponse {
  id: number;
  uploadDate: number;
  graduationYear: number;
  event: string;
  location: string;
  people: string[];
  imageData: string;
  author: number;
} //can't use Photo bc uploadDate is Date type ???
async function fetchPhotoData() {
  const { data, error } = await tryRequestEndpoint<PhotoResponse[]>("/photos");
  if (error) return error;
  let newPhotoArray: Photo[] = data.map((item) => ({
    ...item,
    uploadDate: new Date(item.uploadDate * 1000),
  })); //newPhotoArray is data with changed date format
  console.log(newPhotoArray);
  if (user?.userType === "user") {
    newPhotoArray = newPhotoArray.filter((photo) => photo.author === user.id);
  } // this shouldn't be in frontend - have to be filtered using endpoints?
  photoData.value = newPhotoArray;
}

fetchPhotoData();

async function deletePhoto(photoIndex: number) {
  photoData.value.splice(photoIndex, 1);
  //delete from api
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
  searchInputs.graduationYear = "";
  searchInputs.event = "";
  searchInputs.location = "";
  searchInputs.people = [];
}

const filteredPhotoData = computed(() => {
  return photoData.value.filter((photo) => {
    const gradYearMatch =
      String(photo.graduationYear).includes(
        String(searchInputs.graduationYear)
      ) || searchInputs.graduationYear === "";

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

    const peopleMatch =
      searchInputs.people.some((person) => photo.people.includes(person)) ||
      searchInputs.people.length === 0; //check case too

    return (
      gradYearMatch &&
      uploadDateMatch &&
      eventMatch &&
      locationMatch &&
      peopleMatch
    );
  });
});
</script>

<style scoped></style>
