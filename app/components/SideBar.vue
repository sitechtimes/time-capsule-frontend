<template>
  <aside :class="isCollapsed ? 'w-12' : 'w-64'" class="bg-base-200 sticky right-0 min-h-screen transition-all duration-300">
    <button type="button" class="btn btn-sm btn-circle absolute top-4 right-[-0.75rem] z-10 dark:invert" @click="isCollapsed = !isCollapsed">
      <img v-if="!isCollapsed" src="/arrow-back-outline.svg" aria-hidden="true" class="h-4 select-none dark:invert" draggable="false" />
      <img v-else src="/arrow-forward-outline.svg" aria-hidden="true" class="h-4 select-none dark:invert" draggable="false" />
    </button>

    <div v-if="!isCollapsed" class="w-full content-center p-4 outline-[#e5e5e5]">
      <div class="header content-center">
        <img v-if="store.theme === 'light'" src="/filterlight.svg" class="w-full scale-75 content-center" alt="header" />
        <img v-if="store.theme === 'dark'" src="/filterdark.svg" class="w-full scale-75 content-center" alt="header" />
      </div>

      <div class="content-center">
        <FilterDropdown class="gradfilter w-full content-center" v-model="searchInputs.graduationYear" category="Graduation Year" :choices="graduationYears" />
        <div>
          <label class="label m-2 w-full dark:invert">
            <span class="label-text w-full content-center">Upload Date</span>
          </label>
          <div class="flex gap-4">
            <FilterDropdown v-model="searchInputs.uploadDate.month" category="Month" :choices="months" class="w-full flex-1 content-center" />
            <FilterDropdown v-model="searchInputs.uploadDate.year" category="Year" :choices="uploadYears" class="w-full flex-1 content-center" />
          </div>
        </div>

        <FilterDropdown v-model="searchInputs.event" category="Event" :choices="events" class="w-full content-center" />
        <FilterDropdown v-model="searchInputs.location" category="Location" :choices="locations" class="w-full content-center" />

        <div>
          <label for="people" class="label m-3 w-full content-center dark:invert">
            <span class="label-text">People</span>
            <span class="comma label-text text-sm font-normal lowercase italic">(comma-separated)</span>
          </label>
          <input v-model="personInput" type="text" placeholder="Ex: John Doe, Jane Smith" class="input input-bordered w-full" @input="handlePeopleInput" />
        </div>

        <div class="mb-2 flex flex-wrap gap-2">
          <div v-for="(person, index) in searchInputs.people" :key="person" class="badge badge-neutral m-2 gap-2">
            {{ person }}
            <button type="button" class="btn btn-xs btn-circle btn-ghost" @click="removePerson(index)">
              <img src="/close-outline.svg" aria-hidden="true" class="h-4 opacity-50 select-none dark:invert" draggable="false" />
            </button>
          </div>
        </div>

        <div class="w-full content-center items-end">
          <button type="reset" class="btn btn-outline m-2 w-full content-center" @click="resetInputs">Reset</button>
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

function handlePeopleInput() {
  const name = personInput.value;
  if (name.endsWith(",")) {
    searchInputs.value.people.push(name.slice(0, -1).trim());
    personInput.value = "";
  }
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
