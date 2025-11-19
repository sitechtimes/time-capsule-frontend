<template>
  <div class="navbar bg-base-100 dark:border-base-200 border-base-300 border-b shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <img src="/menu-outline.svg" aria-hidden="true" class="h-5 w-5 dark:invert" draggable="false" />
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
          <li>
            <NuxtLink to="/" class="text-md font-semibold">Homepage</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/upload" class="text-md font-semibold">Upload</NuxtLink>
          </li>
          <li v-if="store.user?.userType === 'supervisor'">
            <NuxtLink to="/admin-inbox" class="text-md font-semibold">Inbox</NuxtLink>
          </li>
          <li v-if="store.user?.userType === 'supervisor'">
            <NuxtLink to="/admin-student-view" class="text-md font-semibold">Students</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <img v-if="store.theme === 'light'" src="/logo.svg" alt="logo" class="scale-85" />
      <img v-if="store.theme === 'dark'" src="/logodark.svg" alt="logo" class="scale-85" />
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
        <ul tabindex="-1" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
          <li>
            <a class="justify-between"> Profile </a>
          </li>
          <li><a>Settings</a></li>
          <li><a @click="handleLogout">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useUserStore();
const router = useRouter();

function toggle() {
  store.theme = store.theme === "light" ? "dark" : "light";
}

function handleLogout() {
  store.signOut();
  void router.push("/login");
}
</script>

<style scoped></style>
