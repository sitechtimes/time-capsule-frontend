import type { Photo } from "../utils/types";
export const usePhotoStore = defineStore("photoStore", () => {
  const photos = ref<Photo[]>([]);

  async function fetchData(url: string, method?: string, body?: any) {
    const config = useRuntimeConfig();

    const options: RequestInit = {
      method,
      credentials: "include"
    };

    if (body instanceof FormData) {
      options.body = body;
    } else if (body) {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }

    return await fetch(config.public.apiBase + url, options);
  }
  async function uploadPhotos(photoData: Photo) {
    const formData = new FormData();

    Object.entries(photoData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });
    const res = await fetchData("/api/file/", "POST", formData);
    if (!res.ok) {
      throw new Error(`Failed to upload photo: ${await res.text()}`);
    }
    return await res.json();
  }
  return {
    photos,
    fetchData,
    uploadPhotos
  };
});
