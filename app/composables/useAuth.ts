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
  async function uploadPhotos(photoData: Record<string, any>) {
    const config = useRuntimeConfig();
    const formData = new FormData();

    Object.entries(photoData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });

    const data = await $fetch(`${config.public.apiBase}/api/file/`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${access.value}`
      }
    });

    return data;
  }

  return { login, logout, access, uploadPhotos };
}
