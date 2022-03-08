import { defineStore } from "pinia";

const initialState = {
  mode: "time",
  language: "english",
  timeValue: 60,
  wordValue: 100,
  sound: false,
  punctations: false,
  numbers: false
};
export const useOptions = defineStore({
  id: "options",
  state: () => initialState,
  actions: {

  },
});
