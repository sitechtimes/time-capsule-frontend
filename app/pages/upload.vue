<template>
  <div class="bg-base-200 text-base-content flex min-h-screen items-center justify-center p-6 pt-20">
    <div class="w-full max-w-2xl space-y-6">
      <h1 class="text-primary mb-4 text-center text-2xl font-semibold">Upload Photos</h1>

      <div v-for="(photo, index) in photos" class="card bg-base-100 border-base-300 rounded-lg border p-6 shadow-md">
        <h2 class="text-secondary mb-4 text-center text-lg font-semibold">Photo {{ index + 1 }}</h2>

        <form class="space-y-4" @submit.prevent>
          <div>
            <DropDown v-model="photo.graduationYear" :choices="currentGradYears" category="Graduation Year" :include-all-option="false" />
          </div>

          <AutofillDropdown v-model="photo.event" category="Event" :choices="events" :include-all-option="false" />
          <AutofillDropdown v-model="photo.location" category="Location" :choices="locations" :include-all-option="false" />

          <div>
            <label class="mb-1 block font-medium">People (comma-separated or hit enter):</label>
            <input
              v-model="photo.personInput"
              type="text"
              placeholder="Ex: John Doe, ..."
              class="input input-bordered bg-base-100 w-full"
              @keydown.enter="handlePeopleInput(photo, 'enter')"
              @input="handlePeopleInput(photo, 'comma')"
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

          <div class="group relative cursor-pointer overflow-visible">
            <div v-if="photo.imageName" class="text-success mt-1 text-sm underline">Selected: {{ photo.imageName }}</div>

            <img
              v-if="photo.imageData"
              :src="photo.imageData"
              class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-4 w-[600px] -translate-x-1/2 scale-95 rounded-sm opacity-0 shadow-2xl transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
            />
          </div>

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

interface PhotoForm {
  graduationYear: number;
  event: string;
  location: string;
  personInput: string;
  people: string[];
  imageData: string;
  imageName?: string;
}

const userStore = useUserStore();
const photos = ref<PhotoForm[]>([]);
const router = useRouter();
const showConfirmUploadModal = ref(false);
const showConfirmRedirectModal = ref(false);
const showConfirmDeleteModal = ref(false);
const currentYear = new Date().getFullYear();
const events = ref<string[]>([]);
const locations = ref<string[]>([]);

function createPhotoFormWithImage(base64: string, name: string): PhotoForm {
  return {
    graduationYear: currentYear,
    event: "",
    location: "",
    personInput: "",
    people: [],
    imageData: base64,
    imageName: name
  };
}

function removeForm(index: number) {
  photos.value.splice(index, 1);
  showConfirmDeleteModal.value = false;
}

function handlePeopleInput(photo: PhotoForm, action: "enter" | "comma") {
  let input = photo.personInput;
  if (action === "comma") {
    if (!input.endsWith(",")) return;
    input = input.slice(0, -1);
  }
  const name = input.trim();
  if (!name || photo.people.includes(name)) {
    photo.personInput = "";
    return;
  }
  photo.people.push(name);
  photo.personInput = "";
}

function removePerson(photo: PhotoForm, index: number) {
  photo.people.splice(index, 1);
}

const multiFileInput = useTemplateRef("multipleFileInput");

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

async function handleMultipleFiles() {
  const input = multiFileInput.value;
  if (!input?.files) return;

  for (const file of Array.from(input.files)) {
    try {
      const base64 = await readFileAsBase64(file);
      if (photos.value.some((photo) => photo.imageData?.includes(base64))) {
        alert("there's already an image with this data"); //how to check if its alr uploaded?
        input.value = "";
        return;
      }
      photos.value.push(createPhotoFormWithImage(base64, file.name));
    } catch (error) {
      console.error(`Error reading file ${file.name}:`, error);
    }
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
function getCurrentGradYears(): number[] {
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  const minYearsAhead = currentMonthIndex > 5 ? 1 : 0;
  const maxYearsAhead = currentMonthIndex > 5 ? 4 : 3;
  const gradYears = [];
  for (let yearsAhead = minYearsAhead; yearsAhead <= maxYearsAhead; yearsAhead++) {
    gradYears.push(currentYear + yearsAhead);
  }
  return gradYears;
}
const currentGradYears = getCurrentGradYears();

async function uploadPhotos() {
  showConfirmUploadModal.value = false;
  if (photos.value.length === 0) {
    alert("No photos added");
    return;
  }
  for (const [index, photo] of photos.value.entries()) {
    if (!photo.imageData || !photo.event || !photo.location) {
      alert(`No image data or labels for photo ${index + 1}`);
      return;
    }

    const sendData = {
      uploadDate: Math.floor(Date.now() / 1000),
      graduationYear: photo.graduationYear,
      event: photo.event,
      location: photo.location,
      people: photo.people,
      imageData: photo.imageData,
      author: userStore.user?.id
    };

    const { data, error } = await tryRequestEndpoint<PhotoUpload>("/upload", "POST", sendData);

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

    // eslint-disable-next-line no-console
    console.log("Uploaded:", data);
  }

  // reset forms
  photos.value = [];
  // reset all file input fields
  if (Array.isArray(multiFileInput.value)) {
    for (const input of multiFileInput.value) {
      if (input) input.value = "";
    }
  }
  showConfirmRedirectModal.value = true;
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
