import { defineStore } from "pinia";

export const useLanguageStore = defineStore({
  id: "language",
  state: () => ({
    selectedLanguage: "english",
  }),
  getters: {
    // doubleCount: (state) => state.counter * 2,
  },
  actions: {
    changeLanguage(languageName) {
      this.selectedLanguage = languageName;
    },
  },
});
