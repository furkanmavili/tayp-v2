<script setup>
import { useScoreStore } from "../stores/score";
import { ref, onMounted, computed, watch, onUpdated, onBeforeUpdate, onActivated } from "vue";
import { getRandomWords, importWords } from "../utils/words";
import { useOptions } from "../stores/options";

const LETTER_HEIGHT = 36;
const IGNORE_KEYS = ["Shift", "CapsLock", "Tab", "Enter", "Alt"];
const CORRECT_CLASS = "text-gray-950 dark:text-slate-100".split(" ");
const WRONG_CLASS = "text-red-400 border-red-400".split(" ");
const CURSOR_TOP_PADDING = 8;
const TOTAL_WORD = 200;
const options = useOptions()

const words = ref([]);
const cursor = ref(0);
const letterRefs = ref([]);
const cursorLeft = ref(0); // cursor left offset
const cursorTop = ref(CURSOR_TOP_PADDING); // cursor top offset
const wordRefs = ref([]); // takes all word divs ref
const startTimer = ref(false);
const timer = ref(options.timeValue);

const scoreStore = useScoreStore();
options.$subscribe(
  async (mutation, state) => {
    restart()
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

// returns array of words with letters; [['h', 'e', 'l', 'l', 'o', '&nbsp;']]
const parsedWords = computed(() => {
  return words.value.map((word) => [...word.split(""), "&nbsp;"]);
});

onMounted(async () => {
  const json = await importWords(options.language);
  words.value = getRandomWords(json.words, TOTAL_WORD);
  // TODO: find a way to remove this listener on unmount
  window.addEventListener("keydown", (e) => {
    if (IGNORE_KEYS.includes(e.key)) return;
    if (e.key === "Backspace") {
      if (cursor.value === 0) return;
      cursor.value--;
      clearClasses();
    } else {
      if (!startTimer.value) {
        startTimer.value = true;
      }
      if (cursor.value > splittedWords.value.length) return;
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
  });
});

onBeforeUpdate(() => {
  letterRefs.value = [];
  wordRefs.value = [];
});

watch(cursor, (newCursor, _) => {
  const currentWord = wordRefs.value[currentWordIndex.value];
  const wordOffsetLeft = currentWord.offsetLeft;
  const wordOffsetTop = currentWord.offsetTop;
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
  if (!startTimer.value) return;
  timer.value -= 1;
  const interval = setInterval(async () => {
    if (!startTimer.value) {
      clearInterval(interval);
      return;
    }
    if (timer.value === 0) {
      onFinish();
      await restart();
      clearInterval(interval);
      return;
    }
    timer.value -= 1;
  }, 1000);
});

function onFinish() {
  const wpm = ((scoreStore.correct / 5) * 60) / options.timeValue;
  scoreStore.setWpm(wpm);
  scoreStore.setShowResults(true);
}

async function restart() {
  startTimer.value = false;
  scoreStore.reset();
  timer.value = options.timeValue;
  const json = await importWords(options.language);
  words.value = getRandomWords(json.words, TOTAL_WORD);
  cursor.value = 0;
  wordRefs.value.forEach((word) => {
    word.style.display = "flex";
  });
  letterRefs.value.forEach((letter) => {
    letter.classList.remove(...CORRECT_CLASS, ...WRONG_CLASS);
  });
}

function clearClasses() {
  currentLetter.value.classList.remove(...CORRECT_CLASS, ...WRONG_CLASS);
}
</script>

<template>
  <div>
     <!-- <div @click="store.changeLanguage('turkish')">change to tr</div> -->
    <div class="text-primary font-semibold text-xl">{{ timer }}</div>
    <div
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
      <button @click="">Retry</button>
    </div>
  </div>
</template>
