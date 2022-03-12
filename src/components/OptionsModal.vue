<script setup>
import { onMounted, ref } from "vue";
import Modal from "./Modal.vue";
import { useOptions } from "../stores/options";

const options = useOptions();
const language = ref(options.language);
const mode = ref(options.mode);
const punctations = ref(options.punctations);
const numbers = ref(options.numbers);

const availableLanguages = ref([]);

onMounted(async () => {
  const json = await import("../assets/languages/_list.json");
  availableLanguages.value = json.langs;
});

function onSubmit() {
  options.$patch({
    mode: mode.value,
    language: language.value,
    punctations: punctations.value,
    numbers: numbers.value,
  });
}
</script>

<template>
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
      <form @submit.prevent="onSubmit" class="flex flex-col space-y-4">
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
            <input class="mr-2 text-primary ring-0" type="radio" id="time" value="time" v-model="mode" />
            <label for="time">Time</label>
          </div>
          <div class="flex items-center">
            <input class="mr-2 text-primary ring-0" type="radio" id="word" value="word" v-model="mode" />
            <label for="word">Word</label>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input
            class="text-primary focus:border-0 focus:outline-none focus:ring-0"
            id="punctations"
            type="checkbox"
            v-model="punctations"
          />
          <label for="punctations">Punctations</label>
          <input
            class="text-primary focus:border-0 focus:outline-none focus:ring-0"
            id="numbers"
            type="checkbox"
            v-model="numbers"
          />
          <label for="numbers">Numbers</label>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <button type="reset" class="button" @click="$refs.optionsModal.closeModal()">Cancel</button>
          <button type="submit" class="button button-primary" @click="$refs.optionsModal.closeModal()">Save</button>
        </div>
      </form>
    </template>
  </modal>
</template>
