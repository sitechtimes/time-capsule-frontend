<template>
  <div class="p-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div>
        <label for="graduation-year" class="label">
          <span class="label-text">Graduation Year</span>
        </label>
        <input
          v-model="searchInputs.graduationYear"
          type="number"
          placeholder="Graduation Year"
          class="input input-bordered w-full"
        />
      </div>

      <div>
        <label class="label">
          <span class="label-text">Upload Date</span>
        </label>
        <div class="flex gap-4">
          <div class="flex-1">
            <label for="month" class="label">
              <span class="label-text">Month</span>
            </label>
            <select
              v-model="searchInputs.uploadDate.month"
              class="select select-bordered w-full"
              name="month"
            >
              <option value="All">All</option>
              <option
                v-for="(month, index) in months"
                :key="month"
                :value="index + 1"
              >
                {{ month }}
              </option>
            </select>
          </div>

          <div class="flex-1">
            <label for="year" class="label">
              <span class="label-text">Year</span>
            </label>
            <select
              v-model="searchInputs.uploadDate.year"
              class="select select-bordered w-full"
              name="year"
            >
              <option value="All">All</option>
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
      </div>

      <div>
        <label for="event" class="label">
          <span class="label-text">Event</span>
        </label>
        <select
          v-model="searchInputs.event"
          name="event"
          id=""
          class="select select-bordered w-full"
        >
          <option v-for="(event, index) in events" :key="index" :value="event">
            {{ event }}
          </option>
        </select>
      </div>

      <div>
        <label for="location" class="label">
          <span class="label-text">Location</span>
        </label>
        <select
          v-model="searchInputs.location"
          name="location"
          id=""
          class="select select-bordered w-full"
        >
          <option
            v-for="(location, index) in locations"
            :key="index"
            :value="location"
          >
            {{ location }}
          </option>
        </select>
      </div>

      <div>
        <label for="people" class="label">
          <span class="label-text">People (comma-separated)</span>
        </label>
        <input
          v-model="personInput"
          type="text"
          placeholder="Ex: John Doe, Jane Smith"
          class="input input-bordered w-full"
          @input="handlePeopleInput"
        />
      </div>

      <div class="flex items-end">
        <button class="btn btn-outline w-full" @click="resetInputs">
          Reset
        </button>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mb-6">
      <div
        v-for="(person, index) in searchInputs.people"
        :key="index"
        class="badge badge-neutral gap-2"
      >
        {{ person }}
        <button
          type="button"
          class="btn btn-xs btn-circle btn-ghost"
          @click="removePerson(index)"
        >
          ✕
        </button>
      </div>
    </div>

    <div id="card-container" class="flex flex-row flex-wrap">
      <PhotoCard
        v-for="(photo, index) in filteredPhotoData"
        :key="photo.id"
        :photoData="photo"
        @delete="deletePhoto(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// filters should be done on backend, not here bc frontend doesn't have ALL photos to filter from
// infinite scroll that loads more photos when scrolled down
// fix layout w sidebar&filters
// deleting from api
// need endpoints - photo limits, events&locations, filtering by user and other stuff
const photoData = ref<Photo[]>([]);
const searchInputs = reactive({
  uploadDate: ref({
    month: "All",
    year: "All",
  }),
  graduationYear: "",
  event: "All",
  location: "All",
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
} //can't use Photo bc uploadDate is Date type
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
  const confirmed = window.confirm(
    "Are you sure you want to delete this photo?"
  );
  if (!confirmed) return;
  photoData.value.splice(photoIndex, 1);
  //delete from api, call "/delete"
  /* const { data, error } = await tryRequestEndpoint(
    "/delete",
    "DELETE",
    {id: photoData.value[photoIndex].id}
  );
  if (error) return error; */
}

const events = ref<string[]>([]);
const locations = ref<string[]>([]);
async function fetchEvents() {
  const { data, error } = await tryRequestEndpoint<string[]>("/events");
  if (error) return error;
  events.value = data;
}
async function fetchLocations() {
  const { data, error } = await tryRequestEndpoint<string[]>("/locations");
  if (error) return error;
  locations.value = data;
}
fetchEvents();
fetchLocations();

function resetInputs() {
  searchInputs.uploadDate = {
    month: "All",
    year: "All",
  };
  searchInputs.graduationYear = "";
  searchInputs.event = "";
  searchInputs.location = "";
  searchInputs.people = [];
}

// should be done on backend bc not all photos are fetched
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
        searchInputs.uploadDate.month === "All") ||
      (photo.uploadDate.getMonth() + 1 ===
        Number(searchInputs.uploadDate.month) &&
        searchInputs.uploadDate.year === "All") ||
      (searchInputs.uploadDate.year === "All" &&
        searchInputs.uploadDate.month === "All");

    const eventMatch =
      photo.event.toLowerCase().includes(searchInputs.event.toLowerCase()) ||
      searchInputs.event === "All";

    const locationMatch =
      photo.location
        .toLowerCase()
        .includes(searchInputs.location.toLowerCase()) ||
      searchInputs.location === "All";

    const peopleMatch =
      searchInputs.people.every((person) => photo.people.includes(person)) ||
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
