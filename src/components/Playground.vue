<script setup>
import { useLanguageStore } from "../stores/language";
import { ref, onMounted, computed, watch, onUpdated, onBeforeUpdate, onActivated } from "vue";
import { getRandomWords, importWords } from "../utils/words";
import { parse } from "@vue/compiler-dom";

const LETTER_HEIGHT = 36;
const IGNORE_KEYS = ["Shift", "CapsLock", "Tab", "Enter", "Alt"];
const CORRECT_CLASS = "text-gray-950 dark:text-slate-100".split(" ");
const WRONG_CLASS = "text-red-400 border-red-400".split(" ");

const words = ref([]);
const cursor = ref(0);
const listRef = ref(null);
const cursorLeft = ref(0); // cursor left offset
const cursorTop = ref(8); // cursor top offset
const wordRefs = ref([]); // takes all word divs ref
const letterRefs = ref([]);
const result = ref({
  correct: 0,
  wrong: 0,
  wpm: null,
  raw_wpm: null,
});

const store = useLanguageStore();
store.$subscribe(
  async (mutation, state) => {
    const json = await importWords(state.selectedLanguage);
    words.value = getRandomWords(json.words, 300);
  },
  { detached: true }
);

// returns word list with letters like ['h', 'e', 'l', 'l', 'o', ' ']
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

// it keeps track of current word index
const currentWordIndex = computed(() => {
  let emptyCount = 0;
  splittedWords.value.slice(0, cursor.value).forEach((item) => {
    if (item === " ") emptyCount++;
  });
  return emptyCount;
});

const currentLetter = computed(() => {
  return Array.from(listRef.value.querySelectorAll(".letter"))[cursor.value];
});

// returns array of words with letters; [['h', 'e', 'l', 'l', 'o', '&nbsp;']]
const parsedWords = computed(() => {
  return words.value.map((word) => [...word.split(""), "&nbsp;"]);
});

onMounted(async () => {
  const json = await importWords(store.selectedLanguage);
  words.value = getRandomWords(json.words, 300);
  // TODO: find a way to remove this listener on unmount
  window.addEventListener("keydown", (e) => {
    if (IGNORE_KEYS.includes(e.key)) return;
    // if (e.ctrlKey && e.key === "Backspace") {
    //   cursor.value -= cursor.value - splittedWords.value.slice(0, cursor.value).lastIndexOf(" ") - 2;
    // }
    if (e.key === "Backspace") {
      if (cursor.value === 0) return;
      cursor.value--;
    } else {
      if (cursor.value > splittedWords.value.length) return;
      // if (splittedWords.value[cursor.value] === " " && e.key !== " ") return;
      if (e.key === splittedWords.value[cursor.value]) {
        currentLetter.value.classList.add(...CORRECT_CLASS);
        currentLetter.value.classList.remove(...WRONG_CLASS);
      } else {
        currentLetter.value.classList.add(...WRONG_CLASS);
        currentLetter.value.classList.remove(...CORRECT_CLASS);
      }
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
  // letters left offset always relative to parent word div, so we need to calculate with
  // current word left offset + current letter left offset
  cursorLeft.value = currentLetter.offsetLeft + wordOffsetLeft;

  // if word is on first row
  if (wordOffsetTop === 0) {
    cursorTop.value = wordOffsetTop + 8;
  } else {
    cursorTop.value = currentLetter.offsetTop + wordOffsetTop + 8;
  }
  // if cursor on begining of last row, delete first row
  if (wordOffsetTop === LETTER_HEIGHT * 2 && wordOffsetLeft === 0 && currentLetter.offsetLeft === 0) {
    const reversedWordRefs = wordRefs.value.reverse();
    for (let i = 0; i < reversedWordRefs.length; i++) {
      if (reversedWordRefs[i].offsetTop === 0) {
        reversedWordRefs[i].style.display = "none";
        cursorTop.value = LETTER_HEIGHT + 8;
      }
    }
  }
});

function clearClasses() {
  currentLetter.value.classList.remove(...CORRECT_CLASS, ...WRONG_CLASS);
}
</script>

<template>
  <div @click="store.changeLanguage('turkish')">change to tr</div>
  <div
    :ref="(el) => (listRef = el)"
    id="words"
    :style="{ height: LETTER_HEIGHT * 3 + 'px' }"
    class="flex flex-wrap text-2xl select-none leading-normal overflow-hidden"
  >
    <div
      :ref="
        (el) => {
          wordRefs[index] = el;
        }
      "
      class="word flex text-gray-400"
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
