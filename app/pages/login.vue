<template>
  <div class="bg-primary flex min-h-screen items-center justify-center px-4">
    <div class="card bg-neutral shadow-accent w-full max-w-md rounded-lg p-6 shadow-[6px_6px_12px_rgba(0,0,0,0.2)]">
      <form class="flex flex-col space-y-4" @submit.prevent="handleLogin">
        <label for="email">Enter in your email: </label>
        <input v-model="loginForm.email" type="text" placeholder="email" class="input bg-neutral mb-4 w-full" />
        <label for="password">Enter in your password: </label>
        <input v-model="loginForm.password" class="input bg-neutral mb-4 w-full" type="password" placeholder="password" />
        <button type="submit" class="btn btn-accent w-full">Login</button>
        <p v-if="errorMessage" class="text-error">{{ errorMessage }}</p>
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

<style scoped>
@media (max-width: 640px) {
  .card {
    padding: 1rem;
    width: 100%;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .card {
    padding: 1.5rem;
    max-width: 28rem;
  }
}

@media (min-width: 1025px) {
  .card {
    padding: 2rem;
    max-width: 32rem;
  }
}
</style>
