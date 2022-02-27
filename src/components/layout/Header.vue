<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <header class="flex justify-between">
    <router-link to="/">
      <div class="relative w-max">
        <div>Tayp</div>
        <span class="absolute text-xs bottom-[-5px] right-[-15px] text-primary">v2</span>
      </div>
    </router-link>
    <router-link to="/login">
      <button class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 stroke-current"
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
        <div>Sign in</div>
      </button>
    </router-link>
  </header>
</template>
