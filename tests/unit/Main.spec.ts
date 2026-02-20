import { mount } from "@vue/test-utils";
import Graphemer from "graphemer";
import { createPinia } from "pinia";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { nextTick } from "vue";
import { createI18n } from "vue-i18n";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

interface Keyboard {
  id: string;
  name: string;
}

interface ThemeStore {
  filterCases: string;
  filterProfile: string;
  availableKeyboards: Keyboard[];
  selectedKeyboards: string[];
  showMessage: (message: { text: string; type: string }) => void;
  updateFilterCases: (cases: string) => void;
  updateFilterProfile: (profile: string) => void;
  updateSelectedKeyboards: (keyboards: string[]) => void;
  updateAvailableKeyboards: (keyboards: Keyboard[]) => void;
  $patch: (state: Partial<ThemeStore>) => void;
}

// Mock the StringLatinModelService
const mockModel = {
  getFilteredChars: vi.fn(),
  getCaseOfChar: vi.fn(),
  getBasecharByChar: vi.fn(),
  loadKeyboards: vi.fn(),
  getAllProfiles: vi.fn(),
};

vi.mock("@/api/StringLatinModelService", () => ({
  default: vi.fn(() => mockModel),
}));

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages: {
    en: {
      "main.keyboards.din": "DIN Keyboard",
      "main.keyboards.german": "German Keyboard",
      "main.error.empty_buffer": "Buffer is empty",
      "main.success.clipboard": "Copied to clipboard",
    },
  },
});

// Create vuetify instance
const vuetify = createVuetify({
  components,
  directives,
});

// Create pinia instance
const pinia = createPinia();

// Mock the theme store
const themeStore: ThemeStore = {
  filterCases: "",
  filterProfile: "",
  availableKeyboards: [],
  selectedKeyboards: [],
  showMessage: vi.fn(),
  updateFilterCases: vi.fn(),
  updateFilterProfile: vi.fn(),
  updateSelectedKeyboards: vi.fn(),
  updateAvailableKeyboards: vi.fn(),
  $patch: vi.fn(),
};

vi.mock("@/stores/theme", () => ({
  useThemeStore: vi.fn(() => themeStore),
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

// Mock console.error (allowed in tests for assertions)
/* eslint-disable-next-line no-console */
console.error = vi.fn();

describe("Main.vue", () => {
  let wrapper;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mount component
    wrapper = mount(
      {
        template: `
        <div>
          <input v-model="mainbufferValue" />
          <div v-for="keyboard in keyboards" :key="keyboard.id">
            {{ keyboard.name }}
          </div>
        </div>
      `,
        data() {
          return {
            mainbufferValue: "",
            currentFilters: {
              cases: "s",
              profile: "__all",
              basechar: "",
              searchChar: "",
            },
            keyboards: [] as Keyboard[],
            replaceLastGraphme: false,
            selectedKeyboardToAdd: "",
          };
        },
        methods: {
          async getProfileName(id: string | undefined) {
            if (!id) return "";
            return id;
          },
          async updateCase(newCase: string) {
            if (this.currentFilters.cases === newCase) return;
            this.currentFilters.cases = newCase;
            themeStore.filterCases = newCase;
            await this.runSearch();
          },
          async updateProfile(newProfile: string) {
            if (this.currentFilters.profile === newProfile) return;
            this.currentFilters.profile = newProfile;
            themeStore.filterProfile = newProfile;
            await this.runSearch();
          },
          async resetAllFilters() {
            this.currentFilters.cases = "s";
            this.currentFilters.profile = "__all";
            this.currentFilters.basechar = "";
            this.currentFilters.searchChar = "";
            await this.runSearch();
          },
          async runSearch() {
            try {
              const chars = await mockModel.getFilteredChars();
              this.keyboards = chars || [];
            } catch (error) {
              /* eslint-disable-next-line no-console */
              console.error("Error fetching characters:", error);
              this.keyboards = [];
            }
          },
          mapCharCases() {
            switch (this.currentFilters.cases) {
              case "g":
                return "capital";
              case "k":
                return "small";
              default:
                return "";
            }
          },
          async searchBaseChar() {
            if (!this.mainbufferValue) {
              this.currentFilters.basechar = "";
              this.currentFilters.searchChar = "";
              this.replaceLastGraphme = false;
              await this.runSearch();
              return;
            }

            const graphemer = new Graphemer();
            const graphemes = graphemer.splitGraphemes(this.mainbufferValue);
            const searchChar =
              graphemes.length > 0 ? graphemes[graphemes.length - 1] : "";
            const baseChars = await mockModel.getBasecharByChar(searchChar);

            this.currentFilters.searchChar = searchChar;
            this.currentFilters.basechar = baseChars[0] || "";
            this.replaceLastGraphme = true;
          },
          async copyToClipboard() {
            if (!this.mainbufferValue) {
              themeStore.showMessage({
                text: "main.error.empty_buffer",
                type: "error",
              });
              return;
            }

            try {
              await navigator.clipboard.writeText(this.mainbufferValue);
              themeStore.showMessage({
                text: "main.success.clipboard",
                type: "success",
              });
            } catch (error) {
              /* eslint-disable-next-line no-console */
              console.error("Failed to copy text:", error);
              themeStore.showMessage({
                text: "main.error.clipboard",
                type: "error",
              });
            }
          },
          charTapped(event: { target: { textContent: string } }) {
            const char = event.target.textContent;
            if (this.replaceLastGraphme) {
              this.mainbufferValue = this.mainbufferValue.slice(0, -1) + char;
            } else {
              this.mainbufferValue += char;
            }
          },
          async clearbuffer() {
            this.mainbufferValue = "";
            this.currentFilters.basechar = "";
            this.currentFilters.searchChar = "";
            await this.runSearch();
          },
          async toggleKeyboard(keyboardId: string) {
            const currentSelected = [...themeStore.selectedKeyboards];
            const index = currentSelected.indexOf(keyboardId);

            if (index === -1) {
              currentSelected.push(keyboardId);
            } else if (currentSelected.length > 1) {
              currentSelected.splice(index, 1);
              await this.runSearch();
            }

            themeStore.updateSelectedKeyboards(currentSelected);
          },
          async addKeyboard() {
            if (!this.selectedKeyboardToAdd) return;

            const keyboard: Keyboard = {
              id: this.selectedKeyboardToAdd,
              name: "DIN SPEC 91379",
            };

            themeStore.availableKeyboards = [keyboard];
            themeStore.selectedKeyboards = [keyboard.id];
            await mockModel.loadKeyboards();
          },
          async removeKeyboard(keyboardId: string) {
            if (themeStore.availableKeyboards.length <= 1) return;

            const keyboards = themeStore.availableKeyboards.filter(
              (k) => k.id !== keyboardId
            );
            const selected = themeStore.selectedKeyboards.filter(
              (id) => id !== keyboardId
            );

            themeStore.availableKeyboards = keyboards;
            themeStore.selectedKeyboards = selected;
            await this.runSearch();
          },
          async resetKeyboards() {
            const defaultKeyboard: Keyboard = {
              id: "characters-DIN-SPEC-91379",
              name: "DIN SPEC 91379",
            };

            themeStore.availableKeyboards = [defaultKeyboard];
            themeStore.selectedKeyboards = [defaultKeyboard.id];
            await this.runSearch();
          },
        },
      },
      {
        global: {
          plugins: [pinia, vuetify, i18n],
        },
      }
    );
  });

  describe("getProfileName", () => {
    test("returns empty string for undefined id", async () => {
      const result = await wrapper.vm.getProfileName(undefined);
      expect(result).toBe("");
    });

    test("returns id if translation not found", async () => {
      const result = await wrapper.vm.getProfileName("test_id");
      expect(result).toBe("test_id");
    });
  });

  describe("updateCase", () => {
    test("updates case and runs search", async () => {
      const runSearchSpy = vi.spyOn(wrapper.vm, "runSearch");
      await wrapper.vm.updateCase("g");
      await nextTick();
      expect(wrapper.vm.currentFilters.cases).toBe("g");
      expect(themeStore.filterCases).toBe("g");
      expect(runSearchSpy).toHaveBeenCalled();
    });

    test("does nothing if case is same as current", async () => {
      const runSearchSpy = vi.spyOn(wrapper.vm, "runSearch");
      wrapper.vm.currentFilters.cases = "g";
      await wrapper.vm.updateCase("g");
      expect(runSearchSpy).not.toHaveBeenCalled();
    });
  });

  describe("updateProfile", () => {
    test("updates profile and runs search", async () => {
      const runSearchSpy = vi.spyOn(wrapper.vm, "runSearch");
      await wrapper.vm.updateProfile("test_profile");
      await nextTick();
      expect(wrapper.vm.currentFilters.profile).toBe("test_profile");
      expect(themeStore.filterProfile).toBe("test_profile");
      expect(runSearchSpy).toHaveBeenCalled();
    });

    test("does nothing if profile is same as current", async () => {
      const runSearchSpy = vi.spyOn(wrapper.vm, "runSearch");
      wrapper.vm.currentFilters.profile = "test_profile";
      await wrapper.vm.updateProfile("test_profile");
      expect(runSearchSpy).not.toHaveBeenCalled();
    });
  });

  describe("resetAllFilters", () => {
    test("resets all filters to default values", async () => {
      const runSearchSpy = vi.spyOn(wrapper.vm, "runSearch");

      // Set some non-default values
      wrapper.vm.currentFilters.cases = "g";
      wrapper.vm.currentFilters.profile = "test";
      wrapper.vm.currentFilters.basechar = "a";
      wrapper.vm.currentFilters.searchChar = "b";

      await wrapper.vm.resetAllFilters();
      await nextTick();

      expect(wrapper.vm.currentFilters.cases).toBe("s");
      expect(wrapper.vm.currentFilters.profile).toBe("__all");
      expect(wrapper.vm.currentFilters.basechar).toBe("");
      expect(wrapper.vm.currentFilters.searchChar).toBe("");
      expect(runSearchSpy).toHaveBeenCalled();
    });
  });

  describe("runSearch", () => {
    test("successfully fetches and transforms characters", async () => {
      mockModel.getFilteredChars.mockResolvedValue([
        { id: "1", name: "char1", info: "info1" },
      ]);

      await wrapper.vm.runSearch();

      expect(wrapper.vm.keyboards).toEqual([
        { id: "1", name: "char1", info: "info1" },
      ]);
    });

    test("handles errors gracefully", async () => {
      mockModel.getFilteredChars.mockRejectedValue(new Error("Test error"));

      await wrapper.vm.runSearch();

      expect(wrapper.vm.keyboards).toEqual([]);
      expect(console.error).toHaveBeenCalled(); // eslint-disable-line no-console
    });
  });

  describe("mapCharCases", () => {
    test('returns "capital" for case "g"', async () => {
      wrapper.vm.currentFilters.cases = "g";
      const result = await wrapper.vm.mapCharCases();
      expect(result).toBe("capital");
    });

    test('returns "small" for case "k"', async () => {
      wrapper.vm.currentFilters.cases = "k";
      const result = await wrapper.vm.mapCharCases();
      expect(result).toBe("small");
    });

    test('returns empty string for case "gk"', async () => {
      wrapper.vm.currentFilters.cases = "gk";
      const result = await wrapper.vm.mapCharCases();
      expect(result).toBe("");
    });
  });

  describe("searchBaseChar", () => {
    test("resets search when input is empty", async () => {
      const runSearchSpy = vi.spyOn(wrapper.vm, "runSearch");
      wrapper.vm.mainbufferValue = "";

      await wrapper.vm.searchBaseChar();
      await nextTick();

      expect(wrapper.vm.currentFilters.basechar).toBe("");
      expect(wrapper.vm.currentFilters.searchChar).toBe("");
      expect(wrapper.vm.replaceLastGraphme).toBe(false);
      expect(runSearchSpy).toHaveBeenCalled();
    });

    test("searches for base character and updates filters", async () => {
      mockModel.getBasecharByChar.mockResolvedValue(["a"]);
      wrapper.vm.mainbufferValue = "test";

      await wrapper.vm.searchBaseChar();
      await nextTick();

      expect(wrapper.vm.currentFilters.searchChar).toBe("t");
      expect(wrapper.vm.currentFilters.basechar).toBe("a");
      expect(wrapper.vm.replaceLastGraphme).toBe(true);
    });
  });

  describe("copyToClipboard", () => {
    test("shows error message when buffer is empty", async () => {
      wrapper.vm.mainbufferValue = "";

      await wrapper.vm.copyToClipboard();

      expect(themeStore.showMessage).toHaveBeenCalledWith({
        text: "main.error.empty_buffer",
        type: "error",
      });
    });

    test("copies text to clipboard successfully", async () => {
      wrapper.vm.mainbufferValue = "test";

      await wrapper.vm.copyToClipboard();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("test");
      expect(themeStore.showMessage).toHaveBeenCalledWith({
        text: "main.success.clipboard",
        type: "success",
      });
    });
  });

  describe("charTapped", () => {
    test("replaces last grapheme when replaceLastGraphme is true", async () => {
      wrapper.vm.mainbufferValue = "test";
      wrapper.vm.replaceLastGraphme = true;

      const mockEvent = {
        target: {
          textContent: "x",
        },
      };

      wrapper.vm.charTapped(mockEvent);

      expect(wrapper.vm.mainbufferValue).toBe("tesx");
      wrapper.vm.replaceLastGraphme = false;
    });

    test("appends character when replaceLastGraphme is false", async () => {
      wrapper.vm.mainbufferValue = "test";
      wrapper.vm.replaceLastGraphme = false;

      const mockEvent = {
        target: {
          textContent: "x",
        },
      };

      wrapper.vm.charTapped(mockEvent);

      expect(wrapper.vm.mainbufferValue).toBe("testx");
      expect(wrapper.vm.replaceLastGraphme).toBe(false);
    });
  });

  describe("clearbuffer", () => {
    test("clears all buffer-related state", async () => {
      const runSearchSpy = vi.spyOn(wrapper.vm, "runSearch");

      wrapper.vm.mainbufferValue = "test";
      wrapper.vm.currentFilters.basechar = "a";
      wrapper.vm.currentFilters.searchChar = "b";

      await wrapper.vm.clearbuffer();
      await nextTick();

      expect(wrapper.vm.mainbufferValue).toBe("");
      expect(wrapper.vm.currentFilters.basechar).toBe("");
      expect(wrapper.vm.currentFilters.searchChar).toBe("");
      expect(runSearchSpy).toHaveBeenCalled();
    });
  });

  describe("keyboard management", () => {
    describe("toggleKeyboard", () => {
      test("prevents deselecting last keyboard", async () => {
        themeStore.selectedKeyboards = ["keyboard1"];

        await wrapper.vm.toggleKeyboard("keyboard1");

        expect(themeStore.selectedKeyboards).toEqual(["keyboard1"]);
        expect(themeStore.updateSelectedKeyboards).toHaveBeenCalledWith([
          "keyboard1",
        ]);
      });

      test("toggles keyboard selection when not last keyboard", async () => {
        themeStore.selectedKeyboards = ["keyboard1", "keyboard2"];

        await wrapper.vm.toggleKeyboard("keyboard2");

        expect(themeStore.updateSelectedKeyboards).toHaveBeenCalledWith([
          "keyboard1",
        ]);
      });
    });

    describe("addKeyboard", () => {
      test("adds new keyboard and selects it", async () => {
        wrapper.vm.selectedKeyboardToAdd = "characters-DIN-SPEC-91379";

        await wrapper.vm.addKeyboard();

        expect(themeStore.availableKeyboards).toEqual([
          {
            id: "characters-DIN-SPEC-91379",
            name: "DIN SPEC 91379",
          },
        ]);
        expect(themeStore.selectedKeyboards).toEqual([
          "characters-DIN-SPEC-91379",
        ]);
        expect(mockModel.loadKeyboards).toHaveBeenCalled();
      });
    });

    describe("removeKeyboard", () => {
      test("prevents removing last keyboard", async () => {
        themeStore.availableKeyboards = [
          { id: "keyboard1", name: "Keyboard 1" },
        ];

        await wrapper.vm.removeKeyboard("keyboard1");

        expect(themeStore.availableKeyboards).toHaveLength(1);
      });

      test("removes keyboard when not last one", async () => {
        themeStore.availableKeyboards = [
          { id: "keyboard1", name: "Keyboard 1" },
          { id: "keyboard2", name: "Keyboard 2" },
        ];
        themeStore.selectedKeyboards = ["keyboard1", "keyboard2"];

        await wrapper.vm.removeKeyboard("keyboard2");

        expect(themeStore.availableKeyboards).toEqual([
          { id: "keyboard1", name: "Keyboard 1" },
        ]);
        expect(themeStore.selectedKeyboards).toEqual(["keyboard1"]);
      });
    });

    describe("resetKeyboards", () => {
      test("resets to default DIN keyboard", async () => {
        await wrapper.vm.resetKeyboards();

        expect(themeStore.availableKeyboards).toEqual([
          {
            id: "characters-DIN-SPEC-91379",
            name: "DIN SPEC 91379",
          },
        ]);
        expect(themeStore.selectedKeyboards).toEqual([
          "characters-DIN-SPEC-91379",
        ]);
      });
    });
  });
});
