import type { Photo } from "../utils/types";
import { useAuth } from "~/composables/useAuth";
export const usePhotoStore = defineStore("photo", () => {
  const photos = ref<Photo[]>([]);
  const auth = useAuth();
  async function uploadPhotos(photoData: uploadedPhoto) {
    try {
      await auth.uploadPhotos(photoData);
    } catch (err: any) {
      return err.value;
    }
  }
  async function getPhotos() {
    try {
      photos.value = await auth.getPhotos();
    } catch (err: any) {
      return err.value;
    }
  }
  return {
    photos,
    uploadPhotos,
    getPhotos
  };
});
