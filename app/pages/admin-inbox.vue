<template>
  <div class="flex h-screen overflow-hidden">
    <div class="w-80 overflow-y-auto border-r border-gray-300 bg-gray-100">
      <InboxMessage v-for="message in messages" :name="message.student" :photo-count="message.photos.length" time="test" @clicked="messageOpened = true" />
    </div>
    <div class="flex-1 overflow-y-auto p-6">
      <div v-if="!messageOpened" class="flex h-full items-center justify-center text-lg text-gray-500">Click on a message to open it</div>
      <OpenedMessage message="test" v-else @close="messageOpened = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
function handleClick() {
  messageOpened.value = true;
  //message= message
}

// only allow open if role is admin
const messageOpened = ref(false);
definePageMeta({
  layout: "dashboard"
});

// fetch messages
interface Message {
  student: string;
  time: string;
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
  const { data, error } = await tryRequestEndpoint<PhotoResponse[]>("/photos");
  if (error) return error;
  let newPhotoArray = formatPhotoDate(data);
  if (user?.userType === "user") {
    newPhotoArray = newPhotoArray.filter((photo) => photo.author === user.id);
  } // this shouldn't be in frontend - filter by user with endpoint
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
    student: "test",
    time: "test",
    photos: photoData.value
  }
]);
</script>
