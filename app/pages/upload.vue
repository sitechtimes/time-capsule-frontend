<template>
  <div>
    <h1>Upload Photo</h1>
    <form @submit.prevent="uploadPhoto">
      <div>
        <label for="uploadDate">Upload Date:</label>
        <input type="date" v-model="uploadForm.uploadDate" required />
      </div>
      <div>
        <label for="graduationYear">Graduation Year:</label>
        <input type="number" v-model="uploadForm.graduationYear" required />
      </div>
      <div>
        <label for="event">Event:</label>
        <input type="text" v-model="uploadForm.event" required />
      </div>
      <div>
        <label for="location">Location:</label>
        <input type="text" v-model="uploadForm.location" required />
      </div>
      <div>
        <label for="people">People (comma-separated):</label>
        <input type="text" v-model="uploadForm.people" required />
      </div>
      <div v-for="ppl in ['aaaaa']">
        <div
          class="rounded-full bg-neutral-200 flex items-center justify-center gap-2"
        >
          <p class="text-black">{{ ppl }}</p>
          <p>X</p>
        </div>
      </div>
      <div>
        <label for="imageData">Image Data (Json Blob):</label>
        <input ref="fileInput" type="file" accept="image/*" />
      </div>
      <button type="submit">Upload Photo</button>
    </form>
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

const fileInput = useTemplateRef("fileInput");

async function uploadPhoto() {
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    const base64String = reader.result;
    console.log(base64String); // data:image/png;base64,...
  };

  reader.readAsDataURL(file);

  const { data, error } = await tryRequestEndpoint<Photo>("/upload", "POST", {
    uploadDate: Number(uploadForm.uploadDate) / 1000,
    graduationYear: uploadForm.graduationYear,
    event: uploadForm.event,
    location: uploadForm.location,
    people: uploadForm.people,
    imageData: uploadForm.imageData,
    author: userStore.user?.id,
  });

  if (error) return error;

  console.log("Photo uploaded successfully:", data);
}
</script>

<style scoped></style>
