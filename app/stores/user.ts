export const useAuthStore = defineStore("authStore", () => {
  const user = ref<User | null>(null);
  const errorMessage = ref("");

  function signOut() {
    user.value = null;
  }

  async function signIn(email: string, password: string) {
    try {
      user.value = await $fetch("/api/login", {
        method: "POST",
        body: { email, password },
      });
      console.log(user.value);
    } catch (error) {
      errorMessage.value = `Login error: ${error}`;
    }
  }
  return {
    user,
    errorMessage,
    signOut,
    signIn,
  };
});
