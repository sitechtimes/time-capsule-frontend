export const useAuth = () => {
  const access = useCookie<string | null>("access_token");
  const refresh = useCookie<string | null>("refresh_token");

  const login = async (email: string, password: string) => {
    const config = useRuntimeConfig();

    const data = await $fetch<{
      access: string;
      refresh: string;
    }>(`${config.public.apiBase}/api/token/`, {
      method: "POST",
      body: { email, password }
    });

    access.value = data.access;
    refresh.value = data.refresh;
  };

  const logout = () => {
    access.value = null;
    refresh.value = null;
  };

  return { login, logout, access };
};
