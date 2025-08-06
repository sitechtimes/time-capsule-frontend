<template>
  <div class="flex justify-center items-start min-h-screen bg-primary p-6">
    <div class="w-full max-w-2xl space-y-6">
      <h1 class="text-2xl font-semibold mb-4 text-center text-accent">
        Upload Photos
      </h1>

      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="card bg-neutral shadow-[6px_6px_12px_rgba(0,0,0,0.2)] shadow-accent rounded-lg p-6"
      >
        <h2 class="text-lg font-semibold mb-4 text-center">
          Photo {{ index + 1 }}
        </h2>
        <form class="space-y-4" @submit.prevent>
          <div>
            <label class="block mb-1" for="uploadDate">Upload Date:</label>
            <input
              type="date"
              v-model="photo.uploadDate"
              required
              class="input w-full bg-base-100"
            />
          </div>

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
              v-for="(ppl, pplIndex) in photo.people"
              :key="pplIndex"
              class="rounded-full bg-neutral-200 px-3 py-1 flex items-center gap-2"
            >
              <span class="text-black">{{ ppl }}</span>
              <button type="button" @click="removePerson(photo, pplIndex)">
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
              class="btn btn-error w-full max-w-xs"
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
  uploadDate: Date;
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
    uploadDate: new Date(),
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
    const trimmed = name.slice(0, -1).trim();
    if (trimmed && !photo.people.includes(trimmed)) {
      photo.people.push(trimmed);
    }
    photo.personInput = "";
  }
}

function removePerson(photo: PhotoForm, index: number) {
  photo.people.splice(index, 1);
}

const fileInputs = useTemplateRef("fileInput");

async function uploadPhotos() {
  for (const photo of photos.value) {
    //figure out how to iterate through the uploaded files for the one that matches the current photo form
    const file = fileInputs.value?.files?.[0];
    if (!file) return alert("No file selected");

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      console.log(base64String); // data:image/png;base64,...
      photo.imageData = base64String as string;
    };

    reader.readAsDataURL(file);

    const sendData = {
      uploadDate: Number(photo.uploadDate) / 1000,
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
      sendData
    );

    if (error) return console.error("Upload error:", error);

    console.log("Uploaded:", data);
  }

  photos.value = [];
  addNewForm();
}
addNewForm();
</script>
