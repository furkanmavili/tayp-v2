<script setup>
import { useLanguageStore } from "../stores/language";
import { storeToRefs } from "pinia";
import { ref, onMounted, computed, watch, onUpdated, onBeforeUpdate, onActivated } from "vue";
import { parse } from "@vue/compiler-dom";

async function importLanguage(fileName) {
  const json = await import(`../assets/languages/${fileName}.json`);
  return json;
}
const words = ref([]);
const cursor = ref(0);
const listRef = ref(null);
const cursorLeft = ref(0);
const cursorTop = ref(8);
const wordRefs = ref([]);

const splittedWords = computed(() => {
  let splittedWords = [];
  words.value.forEach((word) => {
    word.split("").forEach((letter) => {
      splittedWords.push(letter);
    });
    splittedWords.push(" ");
  });
  return splittedWords;
});
const currentWordIndex = computed(() => {
  let emptyCount = 0;
  splittedWords.value.slice(0, cursor.value).forEach((item) => {
    if (item === " ") emptyCount++;
  });
  return emptyCount;
});
const parsedWords = computed(() => {
  return words.value.map((word) => [...word.split(""), "&nbsp;"]);
});

const store = useLanguageStore();
store.$subscribe(
  async (mutation, state) => {
    const json = await importLanguage(state.selectedLanguage);
    words.value = json.words;
  },
  { detached: true }
);
onMounted(async () => {
  const json = await importLanguage(store.selectedLanguage);
  words.value = json.words;
  window.addEventListener("keydown", (e) => {
    if (e.key === "Control" || e.key === "Shift") return;
    if (e.key === "Backspace") {
      if (cursor.value === 0) return;
      cursor.value--;
    } else {
      if (cursor.value > splittedWords.value.length) return;
      cursor.value++;
    }
  });
});

onBeforeUpdate(() => {
  wordRefs.value = [];
});

watch(cursor, (newCursor, _) => {
  const currentWord = wordRefs.value[currentWordIndex.value];
  const wordOffsetLeft = currentWord.offsetLeft;
  const wordOffsetTop = currentWord.offsetTop;
  const currentLetter = Array.from(listRef.value.querySelectorAll(".letter"))[newCursor];
  cursorLeft.value = currentLetter.offsetLeft + wordOffsetLeft;
  console.log(cursor.value);
  if (currentLetter.offsetTop === 0) {
    cursorTop.value = 8 + wordOffsetTop;
  } else {
    cursorTop.value = currentLetter.offsetTop + wordOffsetTop + 8;
  }
});
</script>

<template>
  <div @click="store.changeLanguage('turkish')">change to tr</div>
  <div
    :ref="(el) => (listRef = el)"
    id="words"
    class="flex flex-wrap text-2xl select-none h-[120px] leading-relaxed overflow-hidden"
  >
    <div
      :ref="
        (el) => {
          wordRefs[index] = el;
        }
      "
      class="word flex"
      v-for="(word, index) in parsedWords"
    >
      <div class="letter" v-for="letter in word" v-html="letter"></div>
    </div>
    <div
      class="cursor absolute animate-none"
      :id="cursor"
      :style="{
        left: cursorLeft + 'px',
        top: cursorTop + 'px',
        display: cursor === parsedWords.length ? 'none' : 'block',
      }"
    ></div>
  </div>
</template>
