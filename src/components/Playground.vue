<script setup>
import { useScoreStore } from "../stores/score";
import { ref, onMounted, computed, watch, onUpdated, onBeforeUpdate, onActivated, onBeforeUnmount } from "vue";
import { getRandomWords, importWords } from "../utils/words";
import { useOptions } from "../stores/options";
import confetti from "canvas-confetti";

const LETTER_HEIGHT = 36;
const IGNORE_KEYS = ["Shift", "CapsLock", "Tab", "Enter", "Alt"];
const CORRECT_CLASS = "text-gray-950 dark:text-slate-100".split(" ");
const WRONG_CLASS = "text-red-400 border-red-400".split(" ");
const CURSOR_TOP_PADDING = 8;
const TOTAL_WORD = 200;
const options = useOptions();

const words = ref([]);
const cursor = ref(0);
const letterRefs = ref([]);
const cursorLeft = ref(0); // cursor left offset
const cursorTop = ref(CURSOR_TOP_PADDING); // cursor top offset
const wordRefs = ref([]); // takes all word divs ref
const startTimer = ref(false);
const timer = ref(options.timeValue);
const mobileInput = ref(null);

const scoreStore = useScoreStore();

options.$subscribe(
  async (mutation, state) => {
    restart();
  },
  { detached: false }
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
  return letterRefs.value[cursor.value];
});

const currentWord = computed(() => {
  return wordRefs.value[currentWordIndex.value];
});

// returns array of words with letters; [['h', 'e', 'l', 'l', 'o', '&nbsp;']]
const parsedWords = computed(() => {
  return words.value.map((word) => [...word.split(""), "&nbsp;"]);
});

const onKeyDown = (e) => {
  if (IGNORE_KEYS.includes(e.key) || scoreStore.show_results) return;
  if (e.key === "Backspace") {
    if (cursor.value === 0) return;
    cursor.value--;
    clearClasses();
  } else {
    if (!startTimer.value) {
      startTimer.value = true;
    }
    if (cursor.value > splittedWords.value.length) return;
    if (splittedWords.value[cursor.value] === " " && e.key !== " ") {
      scoreStore.addWrong();
      currentWord.value.classList.add("shake");
      setTimeout(() => {
        currentWord.value.classList.remove("shake");
      }, 200);
      return;
    }

    // if (splittedWords.value[cursor.value] === " " && e.key !== " ") return;
    if (e.key === splittedWords.value[cursor.value]) {
      currentLetter.value.classList.add(...CORRECT_CLASS);
      currentLetter.value.classList.remove(...WRONG_CLASS);
      scoreStore.addCorrect();
    } else {
      currentLetter.value.classList.add(...WRONG_CLASS);
      currentLetter.value.classList.remove(...CORRECT_CLASS);
      scoreStore.addWrong();
    }
    cursor.value++;
  }
};

onMounted(async () => {
  const json = await importWords(options.language);
  words.value = getRandomWords(json.words, TOTAL_WORD);
  // TODO: find a way to remove this listener on unmount
  window.addEventListener("keydown", onKeyDown);
});

onBeforeUpdate(() => {
  letterRefs.value = [];
  wordRefs.value = [];
});

watch(cursor, (newCursor, _) => {
  const wordOffsetLeft = currentWord.value.offsetLeft;
  const wordOffsetTop = currentWord.value.offsetTop;
  // letters left offset always relative to parent word div, so we need to calculate with
  // current word left offset + current letter left offset
  cursorLeft.value = currentLetter.value.offsetLeft + wordOffsetLeft;

  // if word is on first row
  if (wordOffsetTop === 0) {
    cursorTop.value = wordOffsetTop + CURSOR_TOP_PADDING;
  } else {
    cursorTop.value = currentLetter.value.offsetTop + wordOffsetTop + CURSOR_TOP_PADDING;
  }
  // if cursor on begining of last row, delete first row
  if (wordOffsetTop === LETTER_HEIGHT * 2 && wordOffsetLeft === 0 && currentLetter.value.offsetLeft === 0) {
    const reversedWordRefs = wordRefs.value.reverse();
    for (let i = 0; i < reversedWordRefs.length; i++) {
      if (reversedWordRefs[i].offsetTop === 0) {
        reversedWordRefs[i].style.display = "none";
        cursorTop.value = LETTER_HEIGHT + CURSOR_TOP_PADDING;
      }
    }
  }
});

watch(startTimer, () => {
  if (!startTimer.value) {
    return;
  }
  timer.value -= 1;
  const interval = setInterval(async () => {
    if (!startTimer.value) {
      clearInterval(interval);
      return;
    }
    if (timer.value === 0) {
      scoreStore.setShowResults(true);
      clearInterval(interval);
      startTimer.value = false;
      onFinish();
      return;
    }
    timer.value -= 1;
  }, 1000);
});

function onFinish() {
  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, 500);
}

async function restart(repeat) {
  startTimer.value = false;
  scoreStore.reset();
  timer.value = options.timeValue;

  if (!repeat) {
    const json = await importWords(options.language);
    words.value = getRandomWords(json.words, TOTAL_WORD);
  }
  wordRefs.value.forEach((word) => {
    word.style.display = "flex";
  });
  letterRefs.value.forEach((letter) => {
    letter.classList.remove(...CORRECT_CLASS, ...WRONG_CLASS);
  });
  cursor.value = 0;
}

function clearClasses() {
  currentLetter.value.classList.remove(...CORRECT_CLASS, ...WRONG_CLASS);
}
</script>

<template>
  <div class="fade flex flex-col items-center gap-4">
    <div>
      <span class="text-5xl font-bold text-primary">
        {{ scoreStore.calculatedWpm(options.timeValue) }}
      </span>
      <span class="text-lg">/ wpm</span>
      <!-- <div>{{ scoreStore.getAccuracy }}</div> -->
    </div>
  </div>
  <div>
    <!-- <div @click="store.changeLanguage('turkish')">change to tr</div> -->
    <div class="text-xl font-semibold text-primary">{{ timer }}</div>
    <div
      id="words"
      :style="{ height: LETTER_HEIGHT * 3 + 'px' }"
      class="flex select-none flex-wrap overflow-hidden text-2xl leading-normal"
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
        <div
          class="letter"
          v-for="(letter, letterIndex) in word"
          :ref="
            (el) => {
              const lindex = parsedWords.slice(0, index).reduce((total, ch) => (total += ch.length), 0) + letterIndex;
              letterRefs[lindex] = el;
            }
          "
          v-html="letter"
        ></div>
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
      <input class="hidden" ref="mobileInput" />
      <div class="flex"></div>
    </div>
    <div class="flex justify-center mt-6">
      <button @click="restart(false)" class="button" title="next practice">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 stroke-current"
          viewBox="0 0 24 24"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 5v14l8 -7z" />
          <path d="M14 5v14l8 -7z" />
        </svg>
      </button>
      <button @click="restart(true)" class="button" title="repeat">
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
          <path d="M4.05 11a8 8 0 1 1 .5 4m-.5 5v-5h5" />
        </svg>
      </button>

      <button class="button" title="share result">
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
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="18" cy="18" r="3" />
          <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
          <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style>
.fade {
  animation: fadein 0.3s;
}
.shake {
  animation: shake 0.3s;
}
</style>
