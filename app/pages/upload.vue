<template>
  <div class="flex justify-center items-center min-h-screen bg-primary p-6">
    <div class="w-full max-w-2xl space-y-6">
      <h1 class="text-2xl font-semibold mb-4 text-center text-accent">
        Upload Photos
      </h1>

      <div
        v-for="(photo, index) in photos"
        class="card bg-neutral shadow-[6px_6px_12px_rgba(0,0,0,0.2)] shadow-accent rounded-lg p-6"
      >
        <h2 class="text-lg font-semibold mb-4 text-center">
          Photo {{ index + 1 }}
        </h2>
        <form class="space-y-4" @submit.prevent>
          <div>
            <label class="block mb-1" for="graduationYear"
              >Graduation Year:</label
            >
            <input
              type="number"
              v-model="photo.graduationYear"
              required
              class="input w-full bg-base-100"
            />
          </div>

          <div>
            <label class="block mb-1" for="event">Event:</label>
            <input
              type="text"
              v-model="photo.event"
              required
              class="input w-full bg-base-100"
            />
          </div>

          <div>
            <label class="block mb-1" for="location">Location:</label>
            <input
              type="text"
              v-model="photo.location"
              required
              class="input w-full bg-base-100"
            />
          </div>

          <div>
            <label class="block mb-1" for="people"
              >People (comma-separated):</label
            >
            <input
              type="text"
              v-model="photo.personInput"
              @input="handlePeopleInput(photo)"
              placeholder="Ex: John Doe, ..."
              class="input w-full bg-base-100"
            />
          </div>

          <div class="flex flex-wrap gap-2 mt-2">
            <div
              v-for="(person, personIndex) in photo.people"
              class="rounded-full bg-neutral-200 px-3 py-1 flex items-center gap-2"
            >
              <span class="text-black">{{ person }}</span>
              <button type="button" @click="removePerson(photo, personIndex)">
                ✕
              </button>
            </div>
          </div>

          <div>
            <label class="block mb-1" for="imageData">Image File:</label>
            <input
              type="file"
              accept="image/*"
              ref="fileInput"
              required
              class="file-input w-full"
            />
            <div v-if="photo.imageData" class="mt-1 text-sm text-success">
              Image selected
            </div>
          </div>

          <div v-if="photos.length > 1" class="mt-3 text-center">
            <button
              type="button"
              class="btn btn-accent w-full max-w-xs"
              @click="removeForm(index)"
            >
              Remove Photo
            </button>
          </div>
        </form>
      </div>

      <button
        type="button"
        class="btn btn-secondary w-full"
        @click="addNewForm"
      >
        + Add Another Photo
      </button>

      <button type="button" class="btn btn-accent w-full" @click="uploadPhotos">
        Upload All Photos
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
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

function createEmptyPhotoForm(): PhotoForm {
  return {
    graduationYear: new Date().getFullYear(),
    event: "",
    location: "",
    personInput: "",
    people: [],
    imageData: "",
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
        const base64 = result.split(",")[1];
        if (base64) {
          resolve(base64);
        } else {
          reject("Base64 data not found in result");
        }
      } else {
        reject("File could not be converted to base64");
      }
    };

    reader.onerror = () => reject("FileReader failed");
    reader.readAsDataURL(file);
  });
}

async function uploadPhotos() {
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
        author: userStore.user?.id,
      };

      const { data, error } = await tryRequestEndpoint<Photo>(
        "/upload",
        "POST",
        sendData,
      );

      if (error) {
        console.error("Upload error:", error);
        return;
      }

      console.log("Uploaded:", data);
    } catch (e) {
      console.error(`Error reading file for photo ${index + 1}:`, e);
    }
  }

  photos.value = [];
  addNewForm();
}

addNewForm();
</script>
