import { useAuth } from "~/composables/useAuth";
export const useUserStore = defineStore("user", () => {
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
  const user = ref<User | null>(null);
  async function fetchUser() {
    try {
      const data = await auth.fetchUser();
      user.value = data.user;
    } catch {
      user.value = null;
    }
  }
  async function login(email: string, password: string) {
    try {
      const data = await auth.login(email, password);
      user.value = data.user;
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
    refresh,
    fetchUser
  };
});
