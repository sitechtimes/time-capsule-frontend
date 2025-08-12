<template>
  <div class="relative">
    <label :for="category" class="mb-1 block">
      <span class="mb-1 block">{{ category }}</span>
    </label>
    <input v-model="search" class="input input-bordered w-full" :placeholder="'Search ' + category" :name="category" @focus="open = true" @blur="handleBlur" @input="onInput" />

    <ul v-if="open && filteredChoices.length" class="bg-base-100 absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border shadow">
      <li v-for="choice in filteredChoices" :key="choice" class="hover:bg-neutral cursor-pointer px-4 py-2" @click="selectChoice(choice)">
        {{ choice }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  category: "Event" | "Location";
  choices: string[];
}>();

const modelValue = defineModel<string>();
const search = ref(modelValue.value ?? "");
const open = ref(false);

const filteredChoices = computed(() => {
  if (!search.value) return props.choices;
  return props.choices.filter((choice) => choice.toLowerCase().includes(search.value.toLowerCase()));
});

function selectChoice(choice: string) {
  search.value = choice;
  modelValue.value = choice;
  open.value = false;
}

function handleBlur() {
  setTimeout(() => (open.value = false), 100);
}

function onInput() {
  modelValue.value = search.value;
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
