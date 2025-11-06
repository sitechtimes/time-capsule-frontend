<template>
  <aside :class="isCollapsed ? 'w-12' : 'w-64'" class="bg-base-100 sticky right-0 min-h-screen border-[#c3c5c5] transition-all duration-300">
    <button type="button" class="btn btn-sm btn-circle absolute top-4 right-[-0.75rem] z-10 dark:invert" @click="isCollapsed = !isCollapsed">
      <img v-if="!isCollapsed" src="/arrow-back-outline.svg" aria-hidden="true" class="h-4 select-none dark:invert" draggable="false" />
      <img v-else src="/arrow-forward-outline.svg" aria-hidden="true" class="h-4 select-none dark:invert" draggable="false" />
    </button>

    <div v-if="!isCollapsed" class="align-center border-base-300 dark:border-base-300 w-full items-center border-r p-4 shadow-sm">
      <div class="header w-full content-center items-center">
        <img v-if="store.theme === 'light'" src="/filterlight.svg" class="w-full scale-75 items-center" alt="header" />
        <img v-if="store.theme === 'dark'" src="/filterdark.svg" class="w-full scale-75 items-center" alt="header" />
      </div>

      <div class="w-full items-center">
    <div v-if="!isCollapsed" class="p-4">
      <h2 class="mb-6 text-xl font-bold">Filters</h2>
      <div>
        <AutofillDropdown v-model="searchInputs.graduationYear" category="Graduation Year" :choices="graduationYears" include-all-option />
        <div>
          <label class="label w-full dark:invert">
            <span v-if="store.theme === 'light'" class="label-text m-4 w-full text-center text-xl tracking-widest text-black">Upload Date</span>
            <span v-if="store.theme === 'dark'" class="label-text m-4 w-full text-center text-xl tracking-widest text-[#e5e5e5]">Upload Date</span>
          </label>
          <div class="flex gap-4">
            <AutofillDropdown v-model="searchInputs.uploadDate.month" category="Month" :choices="months" include-all-option class="flex-1" />
            <AutofillDropdown v-model="searchInputs.uploadDate.year" category="Year" :choices="uploadYears" include-all-option class="flex-1" />
          </div>
        </div>
        <AutofillDropdown v-model="searchInputs.event" category="Event" :choices="events" include-all-option />
        <AutofillDropdown v-model="searchInputs.location" category="Location" :choices="locations" include-all-option />

        <div class="w-full content-center items-center">
          <label for="people" class="flex w-full flex-col items-center dark:invert">
            <span v-if="store.theme === 'light'" class="mt-4 mb-0 text-xl leading-none tracking-widest text-black">People</span>
            <span v-if="store.theme === 'dark'" class="mt-4 mb-0 text-xl leading-none tracking-widest text-[#e5e5e5]">People</span>
            <span v-if="store.theme === 'light'" class="mt-0 mb-4 text-sm leading-none font-normal text-[#5d6a7b] lowercase italic">(comma-separated)</span>
            <span v-if="store.theme === 'dark'" class="mt-0 mb-4 text-sm leading-none font-normal text-[#c3c5c5] lowercase italic">(comma-separated)</span>
          </label>
          <input
            v-model="personInput"
            type="text"
            placeholder="Ex: John Doe, Jane Smith"
            class="input input-bordered w-full"
            @keydown.enter="handlePeopleInput(searchInputs, 'enter')"
            @input="handlePeopleInput(searchInputs, 'comma')"
          />
        </div>

        <div class="mb-2 flex w-full flex-wrap content-center items-center gap-2">
          <div v-for="(person, index) in searchInputs.people" :key="person" class="badge badge-neutral m-2 gap-2">
            {{ person }}
            <button type="button" class="btn btn-xs btn-hover:[##567CAD] bg-neutral" @click="removePerson(index)">
              <img src="/close-outline.svg" aria-hidden="true" class="h-4 opacity-50 select-none dark:invert" draggable="false" />
            </button>
          </div>
        </div>

        <div class="contents-center w-full items-center text-center">
          <button v-if="store.theme === 'light'" type="reset" class="btn btn-outline-[#779FD3] mb-2 w-full bg-[#779FD3] text-center font-normal text-white hover:bg-[#567CAD]" @click="resetInputs">
            Reset
          </button>
          <button v-if="store.theme === 'dark'" type="reset" class="btn btn-outline-[#254D82] mb-2 w-full bg-[#254D82] text-center font-normal text-white hover:bg-[#183F72]" @click="resetInputs">
            Reset
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const isCollapsed = ref(false);
const store = useUserStore();

const searchInputs = defineModel("searchInputs", {
  type: Object,
  default: () => ({
    uploadDate: {
      month: "All",
      year: "All"
    },
    graduationYear: "All",
    event: "All",
    location: "All",
    people: []
  })
});
const personInput = ref("");

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const graduationYears: number[] = [];
for (let year = 2026; year <= currentYear + 4; year++) {
  graduationYears.push(year);
}
const uploadYears: number[] = [];
for (let year = 2025; year <= currentYear; year++) {
  uploadYears.push(year);
}

function removePerson(index: number) {
  searchInputs.value.people.splice(index, 1);
}

function handlePeopleInput(photo: Photo, action: "enter" | "comma") {
  let input = personInput.value;
  if (action === "comma") {
    if (!input.endsWith(",")) return;
    input = input.slice(0, -1);
  }
  const name = input.trim();
  if (!name || photo.people.includes(name)) {
    personInput.value = "";
    return;
  }
  photo.people.push(name);
  personInput.value = "";
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

function resetInputs() {
  searchInputs.value.uploadDate = {
    month: "All",
    year: "All"
  };
  searchInputs.value.graduationYear = "All";
  searchInputs.value.event = "All";
  searchInputs.value.location = "All";
  searchInputs.value.people = [];
  personInput.value = "";
}

onMounted(() => {
  void fetchEvents();
  void fetchLocations();
});
</script>
<style scoped>
label {
  font-family: "Outfit", sans-serif;
  font-weight: 600;
  letter-spacing: 10;
  text-transform: uppercase;
}
</style>
