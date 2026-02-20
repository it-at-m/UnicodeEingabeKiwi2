import { defineStore } from "pinia";

import { Levels } from "@/api/error";

interface Message {
  message: string;
  level: Levels;
  timeout?: number;
}

interface ThemeState {
  isDark: boolean;
  compactView: boolean;
  automaticFocus: boolean;
  displaySerif: boolean;
  filterCases: string;
  filterProfile: string;
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
    compactView: false,
    automaticFocus: true,
    displaySerif: false,
    filterCases: "s",
    filterProfile: "__all",
    selectedKeyboards: ["characters-DIN-SPEC-91379"],
    availableKeyboards: [
      { id: "characters-DIN-SPEC-91379", name: "DIN SPEC 91379" },
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

    updateCompactView(value: boolean) {
      this.compactView = value;
    },

    updateAutomaticFocus(value: boolean) {
      this.automaticFocus = value;
    },

    updateDisplaySerif(value: boolean) {
      this.displaySerif = value;
    },

    updateFilterCases(value: string) {
      this.filterCases = value;
    },

    updateFilterProfile(value: string) {
      this.filterProfile = value;
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
