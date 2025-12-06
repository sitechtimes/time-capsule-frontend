<template>
  <div class="dropdown dropdown-end" :class="{ 'dropdown-open': profileDropdownOpen }">
    <button type="button" class="btn btn-ghost btn-circle" @click="profileDropdownOpen = !profileDropdownOpen">
      <div class="indicator">
        <img src="/person-circle-outline.svg" class="h-6 w-6 dark:invert" />
        <span v-if="unreadCount > 0" class="badge badge-error badge-xs indicator-item"> </span>
      </div>
    </button>

    <ul tabindex="-1" class="menu menu-sm dropdown-content bg-base-100 rounded-box relative mt-3 w-80 p-4 shadow">
      <button class="btn btn-xs btn-circle btn-ghost absolute top-2 right-2" @click="profileDropdownOpen = false">
        <img src="/close.svg" aria-hidden="true" class="select-none dark:invert" draggable="false" />
      </button>

      <li class="mt-2 font-semibold">{{ user?.firstName }} {{ user?.lastName }}</li>

      <li>User Type: {{ user?.userType }}</li>
      <li v-if="user && 'graduationYear' in user">Graduation Year: {{ user.graduationYear }}</li>
      <li>Email: {{ user?.email }}</li>

      <li class="mt-2">
        <div v-if="!editing">
          Backup email:
          <span>{{ email || "N/A (Click edit to add one)" }}</span>
          <button class="ml-2 text-blue-600 underline hover:text-blue-800" @click="startEdit">Edit</button>
        </div>

        <div v-else class="mt-2 flex gap-2">
          <input v-model="tempEmail" type="text" class="input input-sm input-bordered text-base-content placeholder-base-content w-full" />

          <button class="btn btn-sm btn-primary" @click="saveEmail">Save</button>
          <button class="btn btn-sm" @click="cancelEdit">Cancel</button>
        </div>

        <p v-if="errorMessage" class="text-error mt-1 text-sm">
          {{ errorMessage }}
        </p>
      </li>

      <li><NuxtLink to="/change-password">Change password</NuxtLink></li>

      <li>
        <a @click="openNotifications" class="flex cursor-pointer justify-between">
          Notifications
          <span v-if="unreadCount > 0" class="badge badge-error badge-sm">
            {{ unreadCount }}
          </span>
        </a>

        <ul v-if="showNotifications" class="mt-2 space-y-2">
          <li v-for="notification in newNotifications" class="border-base-300 rounded border p-2" :class="notification.read ? 'opacity-60' : ''">
            <p>{{ notification.message }}</p>
            <span class="text-xs opacity-70">
              {{ notification.createdAt.toLocaleString() }}
            </span>
          </li>
        </ul>
      </li>

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
  //fetch
  //const { data, error } = await tryRequestEndpoint<string>("/backup-email/user");
  // if (error) return error;
  // return data;
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

interface Notification {
  id: number;
  message: string;
  createdAt: Date;
  read: boolean;
}

const newNotifications = ref<Notification[]>([]);

const unreadCount = computed(() => newNotifications.value.filter((notification) => !notification.read).length);
const showNotifications = ref(false);

async function fetchNewNotifications(user) {
  //fetch
  //const { data, error } = await tryRequestEndpoint<Notification[]>("/new-notifs/user");
  // if (error) return error;
  // return data;
  return [
    { id: 1, message: "Your password will expire in 5 days.", createdAt: new Date(), read: false },
    { id: 2, message: "New login from Chrome on Windows.", createdAt: new Date(), read: false },
    { id: 3, message: "Backup email updated successfully.", createdAt: new Date(), read: true }
  ];
}

function openNotifications() {
  showNotifications.value = !showNotifications.value;
  //mark all as read - should update backend as well
  newNotifications.value = newNotifications.value?.map((notification) => ({ ...notification, read: true }));
}

onMounted(async () => {
  email.value = await fetchBackupEmail(props.user);
  newNotifications.value = await fetchNewNotifications(props.user);
});
</script>

<style scoped></style>
