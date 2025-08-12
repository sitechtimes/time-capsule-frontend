<template>
  <aside :class="isCollapsed ? 'w-12' : 'w-64'" class="bg-base-200 sticky right-0 min-h-screen transition-all duration-300">
    <button type="button" class="btn btn-sm btn-circle absolute top-4 right-[-0.75rem] z-10 dark:invert" @click="isCollapsed = !isCollapsed">
      <img v-if="!isCollapsed" src="/arrow-back-outline.svg" aria-hidden="true" class="h-4 select-none dark:invert" draggable="false" />
      <img v-else src="/arrow-forward-outline.svg" aria-hidden="true" class="h-4 select-none dark:invert" draggable="false" />
    </button>

    <div v-if="!isCollapsed" class="p-4">
      <h2 class="mb-6 text-xl font-bold">Filters</h2>

      <div class="">
        <FilterDropdown v-model="searchInputs.graduationYear" category="Graduation Year" :choices="graduationYears" />
        <div>
          <label class="label dark:invert">
            <span class="label-text">Upload Date</span>
          </label>
          <div class="flex gap-4">
            <FilterDropdown v-model="searchInputs.uploadDate.month" category="Month" :choices="months" class="flex-1" />
            <FilterDropdown v-model="searchInputs.uploadDate.year" category="Year" :choices="uploadYears" class="flex-1" />
          </div>
        </div>

        <FilterDropdown v-model="searchInputs.event" category="Event" :choices="events" />
        <FilterDropdown v-model="searchInputs.location" category="Location" :choices="locations" />

        <div>
          <label for="people" class="label dark:invert">
            <span class="label-text">People (comma-separated)</span>
          </label>
          <input v-model="personInput" type="text" placeholder="Ex: John Doe, Jane Smith" class="input input-bordered w-full" @input="handlePeopleInput" />
        </div>

        <div class="flex items-end">
          <button type="reset" class="btn btn-outline w-full" @click="resetInputs">Reset</button>
        </div>
      </div>

      <div class="mb-6 flex flex-wrap gap-2">
        <div v-for="(person, index) in searchInputs.people" :key="person" class="badge badge-neutral gap-2">
          {{ person }}
          <button type="button" class="btn btn-xs btn-circle btn-ghost" @click="removePerson(index)">
            <img src="/close-outline.svg" aria-hidden="true" class="h-4 opacity-50 select-none dark:invert" draggable="false" />
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const isCollapsed = ref(false);

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
