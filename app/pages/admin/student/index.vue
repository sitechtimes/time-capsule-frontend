<template>
  <div>
    <label class="input">
      <img src="/search-outline.svg" aria-hidden="true" class="h-4 opacity-50 select-none dark:invert" draggable="false" />
      <input v-model="searchInput" type="search" placeholder="Search by name" />
    </label>
    <div class="flex flex-row">
      <StudentCard v-for="student in filteredStudents" :student="student" />
    </div>
  </div>
</template>

<script setup lang="ts">
// update this to fetch only students w/ /users/students endpoint or something
const searchInput = ref();
const students = ref<Student[]>([]);
async function fetchStudents() {
  //backend - have limit for # of users fetched
  const { data, error } = await tryRequestEndpoint<Student[]>("/users");
  if (error) return error;
  students.value = data;
}

const filteredStudents = computed(() => {
  if (searchInput.value === "") return students.value;
  return students.value.filter((student) => student.firstName.toLowerCase().includes(searchInput.value.toLowerCase()) ?? student.lastName.toLowerCase().includes(searchInput.value.toLowerCase()));
});

definePageMeta({
  layout: "dashboard"
});

//fetch runs everytime "back to all students" is clicked in child page - should it?
// but saving in store causes problems bc data could change in server
onMounted(() => {
  void fetchStudents();
});
</script>

<style scoped></style>
