<template>
  <aside
    :class="isCollapsed ? 'w-12' : 'w-64'"
    class="bg-base-200 min-h-screen transition-all duration-300 sticky right-0"
  >
    <!-- aside tells browser that this is supporting content, not the main page body; used for sidebars, ads, nav menus, etc. -->
    <!-- Toggle Button (always visible) -->
    <button
      type="button"
      class="btn btn-sm btn-circle absolute top-4 right-[-0.75rem] z-10 dark:invert"
      @click="isCollapsed = !isCollapsed"
    >
      <img
        v-if="!isCollapsed"
        src="/arrow-back-outline.svg"
        aria-hidden="true"
        class="h-4 dark:invert select-none"
        draggable="false"
      />
      <img
        v-else
        src="/arrow-forward-outline.svg"
        aria-hidden="true"
        class="h-4 dark:invert select-none"
        draggable="false"
      />
    </button>

    <!-- Content (only when expanded) -->
    <div v-if="!isCollapsed" class="p-4">
      <h2 class="text-xl font-bold mb-6">Filters</h2>

      <!-- sidebar content -->
      <div class="">
        <FilterDropdown
          v-model="searchInputs.graduationYear"
          category="Graduation Year"
          :choices="getYears('graduation')"
        />
        <div>
          <label class="label dark:invert">
            <span class="label-text">Upload Date</span>
          </label>
          <div class="flex gap-4">
            <FilterDropdown
              v-model="searchInputs.uploadDate.month"
              category="Month"
              :choices="[...months]"
              class="flex-1"
            />
            <FilterDropdown
              v-model="searchInputs.uploadDate.year"
              category="Year"
              :choices="getYears('upload')"
              class="flex-1"
            />
          </div>
        </div>

        <FilterDropdown
          v-model="searchInputs.event"
          category="Event"
          :choices="events"
        />
        <FilterDropdown
          v-model="searchInputs.location"
          category="Location"
          :choices="locations"
        />

        <div>
          <label for="people" class="label dark:invert">
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
          <button
            type="reset"
            class="btn btn-outline w-full"
            @click="resetInputs"
          >
            Reset
          </button>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 mb-6">
        <div
          v-for="(person, index) in searchInputs.people"
          :key="person"
          class="badge badge-neutral gap-2"
        >
          {{ person }}
          <button
            type="button"
            class="btn btn-xs btn-circle btn-ghost"
            @click="removePerson(index)"
          >
            <img
              src="/close-outline.svg"
              aria-hidden="true"
              class="h-4 opacity-50 dark:invert select-none"
              draggable="false"
            />
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
      year: "All",
    },
    graduationYear: "All",
    event: "All",
    location: "All",
    people: [],
  }),
});
const personInput = ref("");

function getYears(type: "upload" | "graduation") {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const yearArray: number[] = [];
  if (type === "upload") {
    for (let year = 2025; year <= currentYear; year++) {
      yearArray.push(year);
    }
  } else if (type === "graduation") {
    for (let year = 2026; year <= currentYear + 4; year++) {
      yearArray.push(year);
    }
  }

  return yearArray;
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
void fetchEvents();
void fetchLocations();

function resetInputs() {
  searchInputs.value.uploadDate = {
    month: "All",
    year: "All",
  };
  searchInputs.value.graduationYear = "All";
  searchInputs.value.event = "All";
  searchInputs.value.location = "All";
  searchInputs.value.people = [];
  personInput.value = "";
}
</script>
