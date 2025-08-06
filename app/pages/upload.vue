<template>
  <div class="flex justify-center items-center min-h-screen bg-accent">
    <div
      class="card bg-neutral shadow-[6px_6px_12px_rgba(0,0,0,0.2)] shadow-primary rounded-lg p-6 w-full max-w-2xl"
    >
      <h1 class="text-2xl font-semibold mb-4 text-center">Upload Photo</h1>
      <form @submit.prevent="uploadPhoto" class="space-y-4">
        <div>
          <label for="uploadDate" class="block mb-1">Upload Date:</label>
          <input
            type="date"
            v-model="uploadForm.uploadDate"
            required
            class="input w-full bg-base-100"
          />
        </div>

        <div>
          <label for="graduationYear" class="block mb-1"
            >Graduation Year:</label
          >
          <input
            type="number"
            v-model="uploadForm.graduationYear"
            required
            class="input w-full bg-base-100"
          />
        </div>

        <div>
          <label for="event" class="block mb-1">Event:</label>
          <input
            type="text"
            v-model="uploadForm.event"
            required
            class="input w-full bg-base-100"
          />
        </div>

        <div>
          <label for="location" class="block mb-1">Location:</label>
          <input
            type="text"
            v-model="uploadForm.location"
            required
            class="input w-full bg-base-100"
          />
        </div>

        <div>
          <label for="people" class="block mb-1"
            >People (comma-separation):</label
          >
          <input
            type="text"
            v-model="personInput"
            @input="handlePeopleInput"
            placeholder="Ex: John Doe, ..."
            class="input w-full bg-base-100"
          />
        </div>

        <div class="flex flex-wrap gap-2 mt-2">
          <div
            v-for="(ppl, index) in uploadForm.people"
            :key="index"
            class="rounded-full bg-neutral-200 px-3 py-1 flex items-center gap-2"
          >
            <span class="text-black">{{ ppl }}</span>
            <button type="button" @click="removePerson(index)">✕</button>
          </div>
        </div>

        <div>
          <label for="imageData" class="block mb-1">Image File:</label>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            required
            class="file-input w-full"
          />
        </div>

        <button type="submit" class="btn btn-primary w-full">Upload</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const uploadForm = reactive({
  uploadDate: new Date(),
  graduationYear: new Date().getFullYear(),
  event: "",
  location: "",
  people: ref<string[]>([]),
  imageData: "",
});

const personInput = ref("");

function handlePeopleInput() {
  const name = personInput.value;
  if (name.endsWith(",")) {
    const trimmedName = name.slice(0, -1).trim();
    if (trimmedName && !uploadForm.people.includes(trimmedName)) {
      uploadForm.people.push(trimmedName);
    }
    personInput.value = "";
  }
}

function removePerson(index: number) {
  uploadForm.people.splice(index, 1);
}

const fileInput = useTemplateRef("fileInput");

async function uploadPhoto() {
  const file = fileInput.value?.files?.[0];
  if (!file) return alert("No file selected");

  const reader = new FileReader();

  reader.onloadend = () => {
    const base64String = reader.result;
    console.log(base64String); // data:image/png;base64,...
    uploadForm.imageData = base64String as string;
  };

  reader.readAsDataURL(file);

  //create a new endpoint for event and location so user can choose from them
  //if it's a new event or location, then user can create one
  const { data, error } = await tryRequestEndpoint<Photo>("/upload", "POST", {
    uploadDate: Math.floor(new Date(uploadForm.uploadDate).getTime() / 1000),
    graduationYear: uploadForm.graduationYear,
    event: uploadForm.event,
    location: uploadForm.location,
    people: uploadForm.people,
    imageData: uploadForm.imageData,
    author: userStore.user?.id,
  });

  if (error) {
    console.error("Upload error:", error);
    return;
  }

  console.log("Photo uploaded successfully:", data);
}
</script>
