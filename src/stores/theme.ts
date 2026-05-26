import { defineStore } from "pinia";

import { Levels } from "@/api/error";
import { KEYBOARD_DIN_91379_ID } from "@/constants";

interface Message {
  message: string;
  level: Levels;
  timeout?: number;
}

interface ThemeState {
  isDark: boolean;
  filterCases: string;
  filterProfile: string;
  /** DIN annex locale profile id, e.g. locale-de; empty = all languages */
  filterLocale: string;
  selectedKeyboards: string[];
  availableKeyboards: { id: string; name: string }[];
  feature: {
    basechar: boolean;
  };
  snackbar: {
    show: boolean;
    message: string;
    level: Levels;
    timeout: number;
  };
}

export const useThemeStore = defineStore("theme", {
  state: (): ThemeState => ({
    isDark: false,
    filterCases: "s",
    filterProfile: "__all",
    filterLocale: "",
    selectedKeyboards: [KEYBOARD_DIN_91379_ID],
    availableKeyboards: [
      { id: KEYBOARD_DIN_91379_ID, name: "DIN 91379:2022-08" },
    ],
    feature: {
      basechar: true,
    },
    snackbar: {
      show: false,
      message: "",
      level: Levels.INFO,
      timeout: 3000,
    },
  }),

  actions: {
    toggleDark() {
      this.isDark = !this.isDark;
    },

    updateFilterCases(value: string) {
      this.filterCases = value;
    },

    updateFilterProfile(value: string) {
      this.filterProfile = value;
    },

    updateFilterLocale(value: string) {
      this.filterLocale = value;
    },

    updateSelectedKeyboards(value: string[]) {
      this.selectedKeyboards = value;
    },

    addSelectedKeyboard(value: string) {
      if (!this.selectedKeyboards.includes(value)) {
        this.selectedKeyboards.push(value);
      }
    },

    removeSelectedKeyboard(value: string) {
      this.selectedKeyboards = this.selectedKeyboards.filter(
        (k) => k !== value
      );
    },

    updateAvailableKeyboards(value: { id: string; name: string }[]) {
      this.availableKeyboards = value;
    },

    addAvailableKeyboard(keyboard: { id: string; name: string }) {
      if (!this.availableKeyboards.find((k) => k.id === keyboard.id)) {
        this.availableKeyboards.push(keyboard);
      }
    },

    removeAvailableKeyboard(keyboardId: string) {
      this.availableKeyboards = this.availableKeyboards.filter(
        (k) => k.id !== keyboardId
      );
    },

    showMessage(message: Message) {
      this.snackbar.message = message.message;
      this.snackbar.level = message.level;
      this.snackbar.timeout = message.timeout || 3000;
      this.snackbar.show = true;
    },

    hideMessage() {
      this.snackbar.show = false;
    },
  },

  persist: true,
});
