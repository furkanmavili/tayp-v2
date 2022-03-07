import { defineStore } from "pinia";

const initialState = {
  mode: "time",
  language: "english",
  timeValue: 60,
  wordValue: 100,
  sound: false,
};
export const useOptions = defineStore({
  id: "options",
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
