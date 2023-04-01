<script setup>
import { RouterView } from "vue-router";
import SiteNavbar from "./components/SiteNavbar.vue";
import SiteFooter from "./components/SiteFooter.vue";
</script>

<template>
  <div class="flex flex-col h-screen justify-between">
    <SiteNavbar />
    <main>
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>
