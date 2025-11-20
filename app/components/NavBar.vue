<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <img src="/menu.svg" aria-hidden="true" class="h-5 w-5" draggable="false" />
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
          <li>
            <NuxtLink to="/" class="text-md font-semibold">Homepage</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/upload" class="text-md font-semibold">Upload</NuxtLink>
          </li>
          <li v-if="store.user?.userType === 'supervisor'">
            <NuxtLink to="/admin/inbox" class="text-md font-semibold">Inbox</NuxtLink>
          </li>
          <li v-if="store.user?.userType === 'supervisor'">
            <NuxtLink to="/admin/students" class="text-md font-semibold">Students</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <a class="btn btn-ghost text-xl">TimeCapsule</a>
    </div>
    <div class="navbar-end">
      <button type="button" class="btn btn-ghost btn-circle">
        <label class="swap swap-rotate">
          <input type="checkbox" @change="toggle" />
          <img src="/sun.svg" aria-hidden="true" class="swap-off h-5 w-5" draggable="false" />
          <img src="/moon.svg" aria-hidden="true" class="swap-on h-5 w-5" draggable="false" />
        </label>
      </button>
      <div class="dropdown dropdown-end">
        <button type="button" class="btn btn-ghost btn-circle">
          <div class="indicator">
            <img src="/person-circle-outline.svg" aria-hidden="true" class="h-5 w-5 select-none dark:invert" draggable="false" />
          </div>
        </button>
        <ul tabindex="-1" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-100 p-2 shadow" @mousedown.prevent>
          <li class="mx-2">{{ user?.firstName }} {{ user?.lastName }}</li>
          <li class="mx-2">{{ user?.email }}</li>

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
          </li>

          <li><a>Change password</a></li>
          <li><a>Notifications</a></li>
          <li><a @click="handleLogout">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useUserStore();
const router = useRouter();
const user = store.user;

function toggle() {
  store.theme = store.theme === "light" ? "dark" : "light";
}

function handleLogout() {
  store.signOut();
  void router.push("/login");
}

const email = ref("bleh");
const editing = ref(false);
const tempEmail = ref(email.value);

function startEdit() {
  tempEmail.value = email.value;
  editing.value = true;
}

function saveEmail() {
  email.value = tempEmail.value;
  editing.value = false;
}

function cancelEdit() {
  tempEmail.value = email.value;
  editing.value = false;
}
</script>

<style scoped></style>
