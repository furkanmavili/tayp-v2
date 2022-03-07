<script setup>
import { RouterView } from "vue-router";
import Header from "./components/layout/Header.vue";
import Footer from "./components/layout/Footer.vue";
</script>

<template>
  <div class="h-full bg-slate-100 text-gray-950 dark:text-slate-100 dark:bg-gray-950">
    <div class="container mx-auto max-w-4xl py-6 px-5 flex flex-col h-full">
      <Header />
      <div class="py-6 flex-1">
        <RouterView />
      </div>
      <Footer />
    </div>
  </div>
</template>

<style>
#app {
  height: 1px; /* I hate this trick */
  min-height: 100vh;
}
</style>
