export function useAuth() {
  const config = useRuntimeConfig();

  const accessToken = useState<string | null>("accessToken", () => null);
  const refreshToken = useState<string | null>("refreshToken", () => null);

  async function login(email: string, password: string) {
    const data = await $fetch<{
      user: User;
      access: string;
      refresh: string;
    }>(`${config.public.apiBase}/users/auth/login/`, {
      method: "POST",
      body: { email, password }
    });

    accessToken.value = data.access;
    refreshToken.value = data.refresh;
    return data;
  }

  async function refresh() {
    if (!refreshToken.value) {
      throw new Error("No refresh token available");
    }
    const data = await $fetch<{ access: string }>(`${config.public.apiBase}/users/auth/refresh/`, {
      method: "POST",
      body: {
        refresh: refreshToken.value
      }
    });

    accessToken.value = data.access;

    return data;
  }

  async function logout() {
    const data = await $fetch<{ access: string }>(`${config.public.apiBase}/users/auth/logout/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      body: {
        refresh: refreshToken.value
      }
    });
    accessToken.value = null;
    refreshToken.value = null;
    return data;
  }

  async function uploadPhotos(photoData: Record<string, any>) {
    const formData = new FormData();

    Object.entries(photoData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });

    return await $fetch("/api/file/", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    });
  }

  return {
    login,
    logout,
    uploadPhotos,
    refreshToken,
    accessToken,
    refresh
  };
}
