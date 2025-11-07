<template>
  <div>
    <label :for="category" class="label">
      <span v-if="store.theme === 'light'" class="label-text text-[#5d6a7b]">{{ category }}</span>
      <span v-if="store.theme === 'dark'" class="label-text text-[#e5e5e5]">{{ category }}</span>
    </label>
    <input v-model="search" class="input input-bordered w-full" :placeholder="'Search ' + category" :name="category" @focus="handleInputFocus" @blur="handleBlur" @input="onInput" />

    <ul v-if="open && filteredChoices.length" class="bg-base-100 absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border shadow">
      <li v-if="includeAllOption" value="All" class="hover:bg-neutral cursor-pointer px-4 py-2" @click="selectChoice('All')">All</li>
      <li v-for="choice in filteredChoices" :key="choice" :value="choice" class="hover:bg-neutral cursor-pointer px-4 py-2" @click="selectChoice(choice.toString())">
        {{ choice }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const store = useUserStore();
const props = defineProps<{
  category: "Graduation Year" | "Month" | "Year" | "Event" | "Location";
  choices: string[] | number[];
  includeAllOption: boolean;
}>();

const modelValue = defineModel<string>();
const search = ref(modelValue.value ?? "");
const open = ref(false);

const filteredChoices = computed(() => {
  if (!search.value || search.value === "All") return props.choices;

  return props.choices.filter((choice) => {
    if (typeof choice === "string") {
      return choice.toLowerCase().includes(search.value.toLowerCase());
    }
    return choice.toString().includes(search.value);
  });
});

function selectChoice(choice: string) {
  search.value = choice;
  modelValue.value = choice;
  open.value = false;
}

function handleBlur() {
  setTimeout(() => (open.value = false), 150);
}

function onInput() {
  modelValue.value = search.value;
}

function handleInputFocus() {
  open.value = true;
  search.value = "";
  modelValue.value = "";
}

watch(
  () => modelValue.value,
  (newVal) => {
    if (newVal !== search.value) {
      search.value = newVal ?? "";
    }
  }
);
</script>
