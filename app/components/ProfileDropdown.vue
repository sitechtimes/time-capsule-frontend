<template>
  <div class="dropdown dropdown-end" :class="{ 'dropdown-open': profileDropdownOpen }">
    <button type="button" class="btn btn-ghost btn-circle" @click="profileDropdownOpen = !profileDropdownOpen">
      <div class="indicator">
        <img src="/person-circle-outline.svg" aria-hidden="true" class="h-5 w-5 select-none dark:invert" draggable="false" />
      </div>
    </button>
    <ul tabindex="-1" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-100 p-2 shadow">
      <li class="px-0 py-0">
        <div class="flex justify-end pr-1">
          <button class="btn btn-circle btn-ghost" @click="profileDropdownOpen = false" aria-label="Close">
            <img src="/close-outline.svg" aria-hidden="true" class="h-5 w-5 select-none dark:invert" draggable="false" />
          </button>
        </div>
      </li>
      <li class="mx-2">{{ user?.firstName }} {{ user?.lastName }}</li>
      <li class="mx-2">User Type: {{ user?.userType }}</li>
      <li v-if="user && 'graduationYear' in user" class="mx-2">Graduation Year: {{ user?.graduationYear }}</li>
      <li class="mx-2">Email: {{ user?.email }}</li>

      <li class="flex flex-col">
        <div v-if="!editing">
          Backup email: <span>{{ email || "N/A (Click edit to add one)" }}</span>
          <button class="ml-2 text-blue-600 underline hover:text-blue-800" @click="startEdit">Edit</button>
        </div>

        <div v-else class="mt-2 flex items-center gap-2">
          <input v-model="tempEmail" type="text" class="rounded border border-gray-300 px-2 py-1" />
          <button class="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700" @click="saveEmail">Save</button>
          <button class="rounded bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300" @click="cancelEdit">Cancel</button>
        </div>
        <p v-if="errorMessage" class="text-error mt-2 text-sm">{{ errorMessage }}</p>
      </li>

      <li><NuxtLink to="/change-password">Change password</NuxtLink></li>
      <li><a>Notifications</a></li>
      <li><a @click="handleLogout">Logout</a></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  user: User;
}>();
const store = useUserStore();
const profileDropdownOpen = ref(false);
const router = useRouter();
const errorMessage = ref("");

function handleLogout() {
  store.signOut();
  void router.push("/login");
}
const email = ref<string>("");
const editing = ref(false);
const tempEmail = ref(email.value);

async function fetchBackupEmail(user) {
  //await backend stuff
  return "backup@gmail.com";
}

function startEdit() {
  tempEmail.value = email.value;
  editing.value = true;
}

function saveEmail() {
  if (errorMessage.value) return console.error("Error:", errorMessage.value);
  errorMessage.value = "";
  email.value = tempEmail.value;
  editing.value = false;
  // post to backend
}

function cancelEdit() {
  tempEmail.value = email.value;
  editing.value = false;
}

watch(
  () => tempEmail.value,
  (newEmail) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(newEmail)) {
      errorMessage.value = "Invalid email format";
    } else {
      errorMessage.value = "";
    }
  }
);

onMounted(async () => {
  email.value = await fetchBackupEmail(props.user);
});
</script>

<style scoped></style>
