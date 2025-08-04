<template>
  <div class="flex flex-col justify-around min-h-[95vh] p-5">
    <form @submit.prevent="handleLogin" class="flex flex-col space-y-4">
      <input
        type="text"
        placeholder="email"
        v-model="loginForm.email"
        class="input mb-4 w-full"
      />
      <input
        class="input mb-4 w-full"
        type="password"
        placeholder="password"
        v-model="loginForm.password"
      />
      <button type="submit" class="btn w-full btn-primary">Login</button>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
const loginForm = reactive({
  email: "",
  password: "",
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

const errorMessage = ref("");
const store = useUserStore();
const router = useRouter();

async function handleLogin() {
  if (!loginForm.email || !loginForm.password) {
    errorMessage.value = "Email and password are required";
    return;
  }
  if (errorMessage.value) return console.log("Error:", errorMessage.value);
  errorMessage.value = "";

  const error = await store.signIn(loginForm.email, loginForm.password);

  if (error) return (errorMessage.value = error.message);

  router.push("/");
}
</script>

<style scoped></style>
