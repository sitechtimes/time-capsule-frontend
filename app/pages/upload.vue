<template>
  <div class="bg-base-200 text-base-content flex min-h-screen items-center justify-center p-6 pt-20">
    <div class="w-full max-w-2xl space-y-6">
      <h1 class="text-primary mb-4 text-center text-2xl font-semibold">Upload Photos</h1>

      <div v-for="(photo, index) in photos" class="card bg-base-100 border-base-300 rounded-lg border p-6 shadow-md">
        <h2 class="text-secondary mb-4 text-center text-lg font-semibold">Photo {{ index + 1 }}</h2>

        <form class="space-y-4" @submit.prevent>
          <div>
            <label class="mb-1 block font-medium">Graduation Year:</label>
            <input v-model="photo.graduationYear" type="number" class="input input-bordered bg-base-100 w-full" :min="currentYear" required />
          </div>

          <AutofillDropdown v-model="photo.event" category="Event" :choices="events" :include-all-option="false" required />
          <AutofillDropdown v-model="photo.location" category="Location" :choices="locations" :include-all-option="false" required />

          <div>
            <label class="mb-1 block font-medium">People (comma-separated or hit enter):</label>
            <input
              type="text"
              placeholder="Ex: John Doe, ..."
              class="input input-bordered bg-base-100 w-full"
              @keydown.enter.prevent="handlePeopleInput($event, photo, 'enter')"
              @input="handlePeopleInput($event, photo, 'comma')"
              required
            />
          </div>

          <div class="mt-2 flex flex-wrap gap-2">
            <div v-for="(person, personIndex) in photo.people" class="bg-base-300 flex items-center gap-2 rounded-full px-3 py-1 text-sm">
              <span>{{ person }}</span>
              <button type="button" @click="removePerson(photo, personIndex)">
                <img src="/close-outline.svg" aria-hidden="true" class="h-4 opacity-50 select-none dark:invert" draggable="false" />
              </button>
            </div>
          </div>

          <div v-if="photo.imageName" class="text-success mt-1 text-sm">Selected: {{ photo.imageName }}</div>

          <div class="mt-3 text-center">
            <button type="button" class="btn btn-outline btn-error w-full max-w-xs" @click="showConfirmDeleteModal = true">Remove Photo</button>
          </div>
          <ConfirmModal
            v-if="showConfirmDeleteModal"
            title="Confirm Delete"
            message="Are you sure you want to delete this photo form?"
            @cancel="showConfirmDeleteModal = false"
            @confirm="removeForm(index)"
          />
        </form>
      </div>

      <div>
        <label class="mb-1 block font-medium" for="multiImageUpload">Select Photos:</label>
        <input ref="multipleFileInput" type="file" accept="image/*" multiple class="file-input file-input-bordered w-full" @change="handleMultipleFiles" />
      </div>

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

const userStore = useUserStore();
const photos = ref<uploadedPhoto[]>([]);
const router = useRouter();
const showConfirmUploadModal = ref(false);
const showConfirmRedirectModal = ref(false);
const showConfirmDeleteModal = ref(false);
const currentYear = new Date().getFullYear();
const events = ref<string[]>([]);
const locations = ref<string[]>([]);
const photoStore = usePhotoStore();
const multiFileInput = useTemplateRef("multipleFileInput");
function createPhotoFormWithFile(file: File, name: string): uploadedPhoto {
  return {
    event: "",
    location: "",
    people: [],
    imageFile: file,
    imageName: name
  };
}

function removeForm(index: number) {
  photos.value.splice(index, 1);
  showConfirmDeleteModal.value = false;
}

function handlePeopleInput(event: Event, photo: Photo, action: "enter" | "comma") {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  if (action === "comma") {
    if (!value.endsWith(",")) return;
    value = value.slice(0, -1);
  }

  const name = value.trim();

  if (!name || photo.people.includes(name)) {
    input.value = "";
    return;
  }

  photo.people.push(name);
  input.value = "";
}

function removePerson(photo: Photo, index: number) {
  photo.people.splice(index, 1);
}

function handleMultipleFiles() {
  const input = multiFileInput.value as HTMLInputElement | undefined;
  if (!input?.files) return;

  for (const file of Array.from(input.files)) {
    const fileName = file.name;
    photos.value.push(createPhotoFormWithFile(file, fileName));
  }
  input.value = "";
}

// see if this can be imported from another file bc used more than once
async function fetchEvents() {
  const { data, error } = await tryRequestEndpoint<string[]>("/events");
  if (error) return error;
  events.value = data;
}
async function fetchLocations() {
  const { data, error } = await tryRequestEndpoint<string[]>("/locations");
  if (error) return error;
  locations.value = data;
}

async function uploadPhotos() {
  showConfirmUploadModal.value = false;
  if (photos.value.length === 0) {
    alert("No photos added");
    return;
  }
  for (const [index, photo] of photos.value.entries()) {
    if (!photo.imageFile) {
      alert(`No image data for photo ${index + 1}`);
      return;
    }
    try {
      await photoStore.uploadPhotos(photo);
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Upload error for photo ${index + 1}`);
      return;
    }
  }
}

function confirmRedirect() {
  showConfirmRedirectModal.value = false;
  void router.push("/");
}

onMounted(() => {
  void fetchEvents();
  void fetchLocations();
});
</script>
