<template>
  <div class="container px-5 py-2 mx-auto lg:pt-12 lg:px-32">
    <div class="flex flex-wrap -m-1 md:-m-2">
      <div
        class="flex flex-wrap md:w-1/4 w-1/2"
        v-for="image in images"
        :key="image.public_id"
      >
        <div class="w-full p-1 md:p-2">
          <img
            alt="gallery"
            class="block object-cover object-center w-full h-full rounded-lg"
            :src="image.secure_url"
          />
        </div>
      </div>
    </div>
    <div class="text-center my-4" v-if="next">
      <button
        class="bg-sky-500 px-4 py-2 text-center text-white border rounded shadow-sm hover:bg-sky-700"
        :disabled="disabled"
        @click="loadMore"
      >
        Load more
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
const images = ref([]);
const next = ref("");

const API_URL = import.meta.env.VITE_API_URL;

const fetchImages = async () => {
  const params = new URLSearchParams();
  params.append("limit", 8);
  try {
    const getImageAPI = `${API_URL}/files/photos?${params}`;
    const { data } = await axios.get(getImageAPI);
    images.value = data.data.resources;
    if (data.data.next_cursor) {
      next.value = data.data.next_cursor;
    }
  } catch (error) {
    console.log(error);
  }
};

const loadMore = async () => {
  if (next.value) {
    const params = new URLSearchParams();
    params.append("next_cursor", next.value);
    params.append("limit", 8);

    try {
      const getImageAPI = `${API_URL}/files/photos?${params}`;
      const { data } = await axios.get(getImageAPI);
      if (data.data.next_cursor) {
        next.value = data.data.next_cursor;
      }
      if (data?.data) {
        for (let i = 0; i < data.data.resources.length; i++) {
          images.value.push(data.data.resources[i]);
        }
        if (data.data.next_cursor) {
          next.value = data.data.next_cursor;
          params.delete("next_cursor");
        } else {
          params.delete("next_cursor");
          next.value = null;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
};

onMounted(() => {
  fetchImages();
});
</script>
