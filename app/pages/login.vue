<template>
  <div>
    <form @submit.prevent="handleLogin">
      <input type="text" placeholder="email" v-model="loginForm.email" />
      <input
        type="password"
        placeholder="password"
        v-model="loginForm.password"
      />
      <button type="submit">Login</button>
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
const store = useAuthStore();
const router = useRouter();

async function handleLogin() {
  errorMessage.value = "";

  await store.signIn(loginForm.email, loginForm.password);

  router.push("/");
}
</script>

<style scoped></style>
