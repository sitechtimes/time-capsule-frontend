export function useAuth() {
  const access = useCookie<string | null>("access_token");
  const refresh = useCookie<string | null>("refresh_token");

  async function login(email: string, password: string) {
    const config = useRuntimeConfig();

    try {
      const data = await $fetch<{
        access: string;
        refresh: string;
      }>(`${config.public.apiBase}/users/token/`, {
        method: "POST",
        body: { email, password }
      });

      access.value = data.access;
      refresh.value = data.refresh;

      return data;
    } catch (error: any) {
      const message = error?.data?.detail || error?.data?.message || "Login failed. Please try again.";
      throw new Error(message);
    }
  }

  function logout() {
    access.value = null;
    refresh.value = null;
  }

  return { login, logout, access };
}
