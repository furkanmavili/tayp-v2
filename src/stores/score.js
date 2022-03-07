import { defineStore } from "pinia";

const initialState = {
  correct: 0,
  wrong: 0,
  wpm: null,
  raw_wpm: null,
  show_results: false,
};
export const useScoreStore = defineStore({
  id: "score",
  state: () => initialState,
  actions: {
    reset() {
      this.correct = 0;
      this.wrong = 0;
      // this.wpm = null;
      // this.raw_wpm = null;
      this.show_results = false;
    },
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
    setShowResults(result) {
      this.show_results = result;
    },
  },
});
