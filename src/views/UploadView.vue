<template>
  <div
    class="flex justify-around w-4/5 m-auto bg-gray-500 rounded-md py-8 px-8"
  >
    <div class="text-center">
      <div class="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
        <div class="text-center">
          <h2 class="mt-5 text-3xl font-bold text-gray-900">Image Upload</h2>
          <p class="mt-2 text-sm text-gray-400">Upload your beautiful image</p>
        </div>
        <form class="mt-8 space-y-3" action="#" method="POST">
          <div class="grid grid-cols-1 space-y-2">
            <label class="text-sm font-bold text-gray-500 tracking-wide"
              >Title</label
            >
            <input
              class="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              type="file"
              placeholder="Beautiful waterfall"
              @change="handleFileChange($event)"
            />
          </div>
          <!-- <div class="grid grid-cols-1 space-y-2">
            <label class="text-sm font-bold text-gray-500 tracking-wide"
              >Attach Document</label
            >
            <div class="flex items-center justify-center w-full">
              <label
                class="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center"
              >
                <div
                  class="h-full w-full text-center flex flex-col items-center justify-center items-center"
                >
                  <div class="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                    <img
                      class="has-mask h-36 object-center"
                      src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                      alt="freepik image"
                    />
                  </div>
                  <p class="pointer-none text-gray-500">
                    <span class="text-sm">Drag and drop</span> files here <br />
                    or
                    <a href="" id="" class="text-blue-600 hover:underline"
                      >select a file</a
                    >
                    from your computer
                  </p>
                </div>
                <input type="file" class="hidden" />
              </label>
            </div>
          </div> -->
          <p class="text-sm text-gray-400">
            <span>File type: jpg, png</span>
          </p>
          <div>
            <button
              type="submit"
              class="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline shadow-lg cursor-pointer transition ease-in duration-300"
              @click.prevent="submitUpload"
              :class="isUploading && 'bg-gray-600'"
              :disabled="uploadStatus"
            >
              {{ isUploading ? "Uploading" : "Upload" }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="text-center w-1/2 flex items-center flex-col">
      <!-- <h3 class="text-center text-white">You image</h3> -->
      <AlertMessage v-if="error" :message="error" />
      <img v-if="previewFile" :src="previewFile" alt="" />
      <p v-if="fileSize" class="text-white">{{ fileSize }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AlertMessage from "../components/AlertMessage.vue";
import axios from "axios";
import { useRouter } from "vue-router";

const API_URL = import.meta.env.VITE_API_URL;

const file = ref(null);
const previewFile = ref("../../public/images/default_image.jpg");
const error = ref(null);
const fileSize = ref(0.0);
const isUploading = ref(false);

const router = useRouter();

const handleFileChange = (e) => {
  error.value = null;
  file.value = e.target.files[0];
  getPreviewImage(file.value);
};

const submitUpload = () => {
  if (!file.value) return;
  let reader = new FileReader();
  reader.readAsDataURL(file.value);
  reader.onloadend = () => {
    uploadImage(reader.result);
  };
};

// call API
const uploadImage = async (file) => {
  isUploading.value = true;
  const formData = new FormData();
  if (file) formData.append("file", file);
  try {
    const { data } = await axios({
      method: "POST",
      url: `${API_URL}/files/upload`,
      data: formData,
      header: {
        "Content-Type": "multipart/form-data",
      },
    });
    router.push("/");
  } catch (error) {
    error.value = error;
    console.log(error);
    isUploading.value = true;
  }
};

//Format image size to human-readable unit
const formatBytes = (size, decimals = 2) => {
  if (size === 0) return "0 bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const getPreviewImage = (image) => {
  const imageExtRegex = /\.(jpe?g|png)$/i;
  if (imageExtRegex.test(image.name)) {
    const fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      previewFile.value = e.target.result;
      fileSize.value = formatBytes(image.size);
    };
    fileReader.readAsDataURL(image);
  } else if (image.size > 1000000) {
    previewFile.value = null;
    error.value = "File maximum size is 1MB";
    fileSize.value = 0.0;
  } else {
    previewFile.value = null;
    error.value = "File is not supported";
    fileSize.value = 0.0;
  }
};
</script>

<style scope>
.has-mask {
  position: absolute;
  clip: rect(10px, 150px, 130px, 10px);
}
.disabledButton {
  background-color: #d8d8d8;
  cursor: not-allowed;
}
</style>
