<template>
  <div class="bg-primary flex min-h-screen items-center justify-center p-6">
    <div class="w-full max-w-2xl space-y-6">
      <h1 class="text-accent mb-4 text-center text-2xl font-semibold">Upload Photos</h1>

      <div v-for="(photo, index) in photos" class="card bg-neutral shadow-accent rounded-lg p-6 shadow-[6px_6px_12px_rgba(0,0,0,0.2)]">
        <h2 class="mb-4 text-center text-lg font-semibold">Photo {{ index + 1 }}</h2>
        <form class="space-y-4" @submit.prevent>
          <div>
            <label class="mb-1 block" for="graduationYear">Graduation Year:</label>
            <input v-model="photo.graduationYear" type="number" required class="input bg-base-100 w-full" />
          </div>

          <div>
            <label class="mb-1 block" for="event">Event:</label>
            <input v-model="photo.event" type="text" required class="input bg-base-100 w-full" />
          </div>

          <div>
            <label class="mb-1 block" for="location">Location:</label>
            <input v-model="photo.location" type="text" required class="input bg-base-100 w-full" />
          </div>

          <div>
            <label class="mb-1 block" for="people">People (comma-separated):</label>
            <input v-model="photo.personInput" type="text" placeholder="Ex: John Doe, ..." class="input bg-base-100 w-full" @input="handlePeopleInput(photo)" />
          </div>

          <div class="mt-2 flex flex-wrap gap-2">
            <div v-for="(person, personIndex) in photo.people" class="flex items-center gap-2 rounded-full bg-neutral-200 px-3 py-1">
              <span class="text-black">{{ person }}</span>
              <button type="button" @click="removePerson(photo, personIndex)">✕</button>
            </div>
          </div>

          <div>
            <label class="mb-1 block" for="imageData">Image File:</label>
            <input ref="fileInput" type="file" accept="image/*" required class="file-input w-full" />
            <div v-if="photo.imageData" class="text-success mt-1 text-sm">Image selected</div>
          </div>

          <div v-if="photos.length > 1" class="mt-3 text-center">
            <button type="button" class="btn btn-accent w-full max-w-xs" @click="removeForm(index)">Remove Photo</button>
          </div>
        </form>
      </div>

      <button type="button" class="btn btn-secondary w-full" @click="addNewForm">+ Add Another Photo</button>

      <button type="button" class="btn btn-accent w-full" @click="showConfirmUploadModal = true">Upload All Photos</button>
    </div>

    <ConfirmModal v-if="showConfirmUploadModal" title="Confirm Upload" message="Are you sure you want to upload photos?" @cancel="showConfirmUploadModal = false" @confirm="uploadPhotos" />
    <ConfirmModal v-if="showConfirmRedirectModal" title="Upload Successful!" message="Redirect to home page?" @cancel="showConfirmRedirectModal = false" @confirm="confirmRedirect" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard"
});

interface PhotoForm {
  graduationYear: number;
  event: string;
  location: string;
  personInput: string;
  people: string[];
  imageData: string;
}

const userStore = useUserStore();
const photos = ref<PhotoForm[]>([]);
const router = useRouter();
const showConfirmUploadModal = ref(false);
const showConfirmRedirectModal = ref(false);

function createEmptyPhotoForm(): PhotoForm {
  return {
    graduationYear: new Date().getFullYear(),
    event: "",
    location: "",
    personInput: "",
    people: [],
    imageData: ""
  };
}

function addNewForm() {
  photos.value.push(createEmptyPhotoForm());
}

function removeForm(index: number) {
  photos.value.splice(index, 1);
}

function handlePeopleInput(photo: PhotoForm) {
  const name = photo.personInput;
  if (name.endsWith(",")) {
    photo.people.push(name.slice(0, -1).trim());
    photo.personInput = "";
  }
}

function removePerson(photo: PhotoForm, index: number) {
  photo.people.splice(index, 1);
}

const fileInputs = useTemplateRef("fileInput");

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("File could not be converted to base64"));
      }
    };

    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.readAsDataURL(file);
  });
}

async function uploadPhotos() {
  showConfirmUploadModal.value = false;
  const inputElements = fileInputs.value;

  if (!inputElements || inputElements.length !== photos.value.length) {
    alert("Each photo must have an image selected");
    return;
  }

  for (const [index, photo] of photos.value.entries()) {
    const input = inputElements[index];
    const file = input?.files?.[0];

    if (!file) {
      alert(`No file selected for photo ${index + 1}`);
      return;
    }

    try {
      const base64String = await readFileAsBase64(file);
      photo.imageData = base64String;

      const sendData = {
        uploadDate: Math.floor(Date.now() / 1000),
        graduationYear: photo.graduationYear,
        event: photo.event,
        location: photo.location,
        people: photo.people,
        imageData: photo.imageData,
        author: userStore.user?.id
      };

      const { data, error } = await tryRequestEndpoint<Photo>("/upload", "POST", sendData);
      const photoData = data?.data; //photoData gives the actual payload (w/o message, statusCode, uploadDate)
      if (error) {
        console.error("Upload error:", error);
        return;
      }

      // eslint-disable-next-line no-console
      console.log("Uploaded:", data);
      userStore.photos.push({
        ...photoData,
        uploadDate: new Date(photoData.uploadDate * 1000)
      });
    } catch (error) {
      console.error(`Error reading file for photo ${index + 1}:`, error);
    }
  }

  // reset forms
  photos.value = [];
  addNewForm();
  // reset all file input fields
  if (Array.isArray(fileInputs.value)) {
    for (const input of fileInputs.value) {
      if (input) input.value = "";
    }
  }
  showConfirmRedirectModal.value = true;
}

addNewForm();

function confirmRedirect() {
  showConfirmRedirectModal.value = false;
  router.push("/");
}
</script>
