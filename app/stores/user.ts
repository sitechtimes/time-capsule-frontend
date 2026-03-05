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
  async function logout() {
    await auth.logout();
    user.value = null;
  }
  async function refresh() {
    await auth.refresh();
  }
  return {
    user,
    theme,
    login,
    logout,
    refresh
  };
});
