<template>
  <div class="bg-base-200 text-base-content flex min-h-screen items-center justify-center px-4">
    <div class="card bg-base-100 border-base-300 w-full max-w-full rounded-lg border p-4 shadow-md sm:max-w-md sm:p-6 md:max-w-lg md:p-6 lg:max-w-xl lg:p-8">
      <form class="flex flex-col space-y-4" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="mb-1 block font-medium">Enter your email:</label>
          <input v-model="loginForm.email" type="text" placeholder="email@example.com" class="input input-bordered bg-base-100 w-full" />
        </div>

        <div>
          <label for="password" class="mb-1 block font-medium">Enter your password:</label>
          <input v-model="loginForm.password" type="password" placeholder="••••••••" class="input input-bordered bg-base-100 w-full" />
        </div>

        <button type="submit" class="btn btn-primary w-full">Login</button>

        <p v-if="errorMessage" class="text-error mt-2 text-sm">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const errorMessage = ref("");
const store = useUserStore();
const router = useRouter();

const loginForm = reactive({
  email: "",
  password: ""
});

watch(
  () => loginForm.email,
  (newEmail) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(newEmail)) {
      errorMessage.value = "Invalid email format";
    } else {
      errorMessage.value = "";
    }
  }
);

async function handleLogin() {
  if (!loginForm.email || !loginForm.password) {
    errorMessage.value = "Email and password are required";
    return;
  }
  if (errorMessage.value) return console.error("Error:", errorMessage.value);
  errorMessage.value = "";

  const error = await store.signIn(loginForm.email, loginForm.password);

  if (error) return (errorMessage.value = error.message);

  void router.push("/");
}
</script>

<style scoped></style>
