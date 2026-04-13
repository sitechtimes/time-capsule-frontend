export function useAuth() {
  const config = useRuntimeConfig();
  async function refresh() {
    return await $fetch(`${config.public.apiBase}/users/auth/refresh/`, {
      method: "POST",
      credentials: "include"
    });
  }
  async function fetch<T>(url: string, options: any = {}): Promise<T> {
    try {
      return (await $fetch<T>(`${config.public.apiBase}${url}`, {
        credentials: "include",
        ...options
      })) as T;
    } catch (err: any) {
      if (err?.response?.status === 401) {
        await refresh();

        return (await $fetch<T>(`${config.public.apiBase}${url}`, {
          credentials: "include",
          ...options
        })) as T;
      }

      throw err;
    }
  }

  async function login(email: string, password: string) {
    return await fetch<{ user: User }>("/users/auth/login/", {
      method: "POST",
      body: { email, password }
    });
  }

  async function logout() {
    return await fetch("/users/auth/logout/", {
      method: "POST"
    });
  }

  async function fetchUser() {
    return await fetch<{ user: User }>("/users/auth/me/", {
      method: "GET"
    });
  }

  async function uploadPhotos(photoData: Record<string, any>) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(photoData)) {
      if (key === "people" && Array.isArray(value)) {
        for (const person of value) {
          formData.append("people[]", person);
        }
      } else {
        formData.append(key, value);
      }
    }
    return await fetch("/api/file/", {
      method: "POST",
      body: formData
    });
  }
  async function getPhotos() {
    return await fetch("/api/filter", {
      method: "GET"
    });
  }

  return {
    fetch,
    login,
    logout,
    refresh,
    fetchUser,
    uploadPhotos,
    getPhotos
  };
}
