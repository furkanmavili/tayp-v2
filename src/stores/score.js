import { defineStore } from "pinia";

export const useScoreStore = defineStore({
  id: "score",
  state: () => ({
    correct: 0,
    wrong: 0,
    wpm: null,
    raw_wpm: null,
  }),
  // getters: {
  //   doubleCount: (state) => state.counter * 2,
  // },
  actions: {
    addCorrect() {
      this.correct++;
    },
    addWrong() {
      this.wrong++;
    },
    setWpm(result) {
      this.wpm = result;
    },
    setRawWpm(result) {
      this.raw_wpm = result;
    },
  },
});
