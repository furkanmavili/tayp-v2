<script setup>
import OptionsModal from '../OptionsModal.vue';
import ThemeSwitch from '../ThemeSwitch.vue';
</script>

<template>
  <header class="flex justify-between">
    <router-link to="/">
      <div class="relative flex w-max items-center gap-2">
        <div class="text-primary">
          <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M21 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-8 2h2v2h-2V7zm0 4h2v2h-2v-2zM9 7h2v2H9V7zm0 4h2v2H9v-2zM5 7h2v2H5V7zm0 4h2v2H5v-2zm12 6H7v-2h10v2zm2-4h-2v-2h2v2zm0-4h-2V7h2v2z"
            ></path>
          </svg>
        </div>
        <div class="text-xl">Tayp</div>
        <span class="absolute bottom-[-5px] right-[-15px] text-xs text-primary">v2</span>
      </div>
    </router-link>
    <div class="flex items-center gap-3">
      <ThemeSwitch />
      <OptionsModal />
      <!-- Soon -->
      <!-- <router-link to="/login">
        <button class="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 stroke-current"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <circle cx="12" cy="7" r="4" />
            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
          </svg>
        </button>
      </router-link> -->
    </div>
  </header>
</template>
