export function useAuth() {
  const config = useRuntimeConfig();

  async function login(email: string, password: string) {
    const data = await $fetch<{
      user: User;
    }>(`${config.public.apiBase}/users/auth/login/`, {
      method: "POST",
      body: { email, password },
      credentials: "include"
    });

    return data;
  }

  async function refresh() {
    const data = await $fetch(`${config.public.apiBase}/users/auth/refresh/`, {
      method: "POST",
      credentials: "include"
    });

    return data;
  }

  async function logout() {
    const data = await $fetch(`${config.public.apiBase}/users/auth/logout/`, {
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

    return await $fetch(`${config.public.apiBase}/api/file/`, {
      method: "POST",
      body: formData,
      credentials: "include"
    });
  }
  async function fetchUser() {
    return await $fetch<{
      user: User;
    }>(`${config.public.apiBase}/users/auth/fetch_user/`, {
      method: "GET",
      credentials: "include"
    });
  }

  return {
    login,
    logout,
    refresh,
    uploadPhotos,
    fetchUser
  };
}
