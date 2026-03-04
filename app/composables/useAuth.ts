export function useAuth() {
  const config = useRuntimeConfig();

  async function login(email: string, password: string) {
    const data = await $fetch<{ user: { id: string; email: string; username: string } }>(`${config.public.apiBase}/users/auth/login/`, {
      method: "POST",
      body: { email, password },
      credentials: "include"
    });

    return data;
  }
  async function refreshToken() {
    const data = await $fetch<{ access: string }>(`${config.public.apiBase}/users/auth/refresh/`, {
      method: "POST",
      credentials: "include"
    });
    return data;
  }
  async function logout() {
    const data = await $fetch<{ detail: string }>(`${config.public.apiBase}/users/auth/logout/`, {
      method: "POST",
      credentials: "include"
    });

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
      credentials: "include"
    });
  }

  return {
    login,
    logout,
    uploadPhotos,
    refreshToken
  };
}
