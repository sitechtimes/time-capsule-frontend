<template>
  <div class="flex h-screen overflow-hidden">
    <div class="w-80 overflow-y-auto border-r border-gray-300 bg-gray-100">
      <InboxMessage v-for="message in messages" :name="message.studentName" :photo-count="message.photos.length" :date="message.date" @clicked="handleClick(message)" />
    </div>
    <div class="flex-1 overflow-y-auto p-6">
      <div v-if="!selectedMessage || !messageOpened" class="flex h-full items-center justify-center text-lg text-gray-500">Click on a message to open it</div>
      <OpenedMessage v-else :name="selectedMessage?.studentName" :photos="photoData" @close="messageOpened = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
// only allow open if role is admin
const messageOpened = ref(false);
const selectedMessage = ref<Message>();
function handleClick(selectedMessageData: Message) {
  messageOpened.value = true;
  selectedMessage.value = selectedMessageData;
}

definePageMeta({
  layout: "dashboard"
});

// fetch messages
interface Message {
  studentName: string;
  date: string;
  photos: Photo[];
}

//temporary lines 27-55 -will update later
function formatPhotoDate(photos: PhotoResponse[]) {
  return photos.map((item) => ({
    ...item,
    uploadDate: new Date(item.uploadDate * 1000)
  }));
}
const photoData = ref<Photo[]>([]);
const user = useUserStore().user;
async function fetchPhotoData() {
  // will be fetched from diff endpoint w/ ONLY pending photos
  const { data, error } = await tryRequestEndpoint<PhotoResponse[]>("/photos");
  if (error) return error;
  let newPhotoArray = formatPhotoDate(data);
  if (user?.userType === "user") {
    newPhotoArray = newPhotoArray.filter((photo) => photo.author === user.id);
  }
  photoData.value.push(...newPhotoArray);
}
interface PhotoResponse {
  id: number;
  uploadDate: number;
  graduationYear: number;
  event: string;
  location: string;
  people: string[];
  imageData: string;
  author: number;
}
onMounted(fetchPhotoData);

const messages = ref<Message[]>([
  {
    studentName: "Test Name",
    date: "test",
    photos: photoData.value
  },
  {
    studentName: "Name Test",
    date: "Friday 10:10",
    photos: photoData.value
  }
]);
</script>
