<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import Modal from "../Modal.vue";

const language = ref("language")
const mode = ref("time");

const availableLanguages = ref([]);
onMounted(async () => {
  const json = await import("../../assets/languages/_list.json");
  availableLanguages.value = json.langs;
});
</script>

<template>
  <header class="flex justify-between">
    <router-link to="/">
      <div class="relative flex w-max items-center gap-2">
        <div class="text-primary">
          <svg
            class="fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style="transform: ; msfilter: "
          >
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
      <router-link to="/login">
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
      </router-link>
      <button @click="$refs.optionsModal.openModal()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 stroke-current"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      <modal ref="optionsModal">
        <template v-slot:header>
          <h1>Settings</h1>
        </template>

        <template v-slot:body>
          <div class="flex flex-col space-y-4">
            <div>
              <div>Language</div>
              <select
                v-model="language"
                class="mt-1 block w-full rounded-md border-gray-300 bg-gray-950 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              >
                <option v-for="lang in availableLanguages">{{ lang }}</option>
              </select>
            </div>

            <div>
              <div>Mode:</div>
              <div class="flex items-center">
                <input class="mr-2 text-primary ring-0" type="radio" id="one" value="time" v-model="mode" />
                <label for="one">Time</label>
              </div>
              <div class="flex items-center">
                <input class="mr-2 text-primary ring-0" type="radio" id="two" value="word" v-model="mode" />
                <label for="two">Word</label>
              </div>

            </div>
  

          </div>
        </template>

        <template v-slot:footer>
          <div class="mt-4 flex justify-end gap-2">
            <button class="button" @click="$refs.optionsModal.closeModal()">Cancel</button>
            <button class="button button-primary" @click="$refs.optionsModal.closeModal()">Save</button>
          </div>
        </template>
      </modal>
    </div>
  </header>
</template>
