import type { Photo } from "../utils/types";
export const usePhotoStore = defineStore("photoStore", () => {
  const photos = ref<Photo[]>([]);

  async function fetchData(url: string, method?: string, body?: any) {
    const options: RequestInit = { credentials: "include" };
    if (method) {
      options.method = method;
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }
    return await fetch(import.meta.env.VITE_URL + url, options);
  }
  async function uploadPhotos(photoData: Photo) {
    const res = await fetchData("/photos/upload", "POST", photoData);
    return await res.json();
  }
  return {
    photos,
    fetchData,
    uploadPhotos
  };
});
