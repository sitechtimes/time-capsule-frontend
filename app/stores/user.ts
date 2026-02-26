import { useAuth } from "~/composables/useAuth";
export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>();
  const theme = ref("light");
  const auth = useAuth();
  /* async function fetchUser() {
    const config = useRuntimeConfig();

    user.value = await $fetch<User>(`${config.public.apiBase}/api/me`, {
      headers: {
        Authorization: `Bearer ${auth.access.value}`
      }
    });
  } */
  async function login(email: string, password: string) {
    try {
      await auth.login(email, password);
    } catch (err: any) {
      return err.value;
    }
  }
  function logout() {
    auth.logout(); // 👈 delegate to composable
    user.value = null;
  }
  return {
    user,
    theme,
    login,
    logout
  };
});
