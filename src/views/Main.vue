# Main.vue
<template>
  <div>
    <v-container fluid>
      <!-- Buffer Panel -->
      <v-row v-if="compactView === false">
        <h1 class="v-label">{{ $t("main.bufferpanel_header") }}</h1>
      </v-row>
      <v-row
        id="bufferpanel"
        class="sticky"
        align="center"
      >
        <v-col mb-4>
          <v-text-field
            id="mainbuffer"
            ref="mainbuffer"
            :model-value="inputValue"
            class="nocap"
            :class="{ serifStyle: displaySerif, sansStyle: displaySans }"
            :label="$t('main.mainbuffer_label')"
            variant="filled"
            density="compact"
            bg-color="white"
            @update:model-value="updateInputValue"
            @keyup.enter.exact="searchBaseChar"
          >
            <template #append>
              <v-btn
                id="clearbufferbutton"
                icon
                :title="$t('main.mainbuffer_alt')"
                @click="clearbuffer"
              >
                <v-icon :icon="mdiClose"></v-icon>
              </v-btn>
              <v-btn
                id="searchcharbutton"
                icon
                :title="$t('main.search_char_alt')"
                @click="searchBaseChar"
                class="ml-2"
              >
                <v-icon :icon="mdiMagnify"></v-icon>
              </v-btn>
              <v-btn
                id="copytobutton"
                icon
                :title="$t('main.clipboard_copy_alt')"
                @click="copyToClipboard"
                class="ml-2"
              >
                <v-icon :icon="mdiContentCopy"></v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <!-- Filter Panel -->
      <v-row v-if="!compactView">
        <h1 class="v-label">{{ $t("main.filterpanel_header") }}</h1>
      </v-row>
      <v-row
        id="filterpanel"
        align="baseline"
      >
        <v-col>
          <v-select
            id="filtercases"
            :model-value="currentFilters.cases"
            class="nocap"
            :label="$t('main.filtercases')"
            :title="$t('main.filtercases_alt')"
            :items="caseing"
            :item-title="(item) => $t(item.name)"
            item-value="id"
            hide-details="auto"
            @update:model-value="updateCase"
          />
        </v-col>
        <v-col>
          <v-select
            id="filterregion"
            :model-value="currentFilters.profile"
            class="nocap"
            :label="$t('main.filterregion')"
            :title="$t('main.filterregion_alt')"
            :items="profiles"
            :item-title="(item) => getProfileName(item.id)"
            item-value="id"
            hide-details="auto"
            @update:model-value="updateProfile"
          />
        </v-col>
        <v-col class="d-flex align-self-center">
          <v-btn
            id="resetallfilters"
            class="nocap hyphen"
            :title="$t('main.filterresetall_alt')"
            @click="resetAllFilters"
          >
            {{ $t("main.filterresetall") }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- Keyboard Selection Panel -->
      <v-row v-if="compactView === false">
        <h1 class="v-label">{{ $t("main.keyboardselection_header") }}</h1>
      </v-row>
      <v-row
        id="keyboardselectionpanel"
        align="center"
        class="mb-4"
      >
        <v-col>
          <div class="d-flex align-center flex-wrap">
            <v-chip
              v-for="(keyboard, index) in sortedAvailableKeyboards"
              :key="keyboard.id"
              :color="
                selectedKeyboards.includes(keyboard.id) ? 'primary' : undefined
              "
              :variant="
                selectedKeyboards.includes(keyboard.id)
                  ? 'elevated'
                  : 'outlined'
              "
              closable
              @click="toggleKeyboard(keyboard.id)"
              @click:close="removeKeyboard(keyboard.id)"
              :disabled="availableKeyboards.length === 1"
              :class="['text-body-1', 'my-2', 'mr-2', { 'ml-2': index > 0 }]"
            >
              {{ keyboard.name }}
            </v-chip>
            <v-btn
              variant="text"
              :prepend-icon="mdiPlus"
              @click="showAddKeyboardDialog = true"
              class="ma-2"
              density="comfortable"
              min-width="120"
            >
              {{ $t("main.add_keyboard") }}
            </v-btn>
            <v-btn
              variant="text"
              :prepend-icon="mdiKeyboardReturn"
              @click="resetKeyboards"
              class="ma-2"
              density="comfortable"
              min-width="120"
              :title="$t('main.reset_keyboards_alt')"
            >
              {{ $t("main.reset_keyboards") }}
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Add Keyboard Dialog -->
      <v-dialog
        v-model="showAddKeyboardDialog"
        max-width="500px"
      >
        <v-card>
          <v-card-title>{{
            $t("main.add_keyboard_dialog_title")
          }}</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedKeyboardToAdd"
              :items="availableKeyboardOptions"
              item-title="name"
              item-value="id"
              :label="$t('main.select_keyboard')"
              :disabled="availableKeyboardOptions.length === 0"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              @click="addKeyboard"
              :disabled="
                !selectedKeyboardToAdd || availableKeyboardOptions.length === 0
              "
            >
              {{ $t("main.add") }}
            </v-btn>
            <v-btn
              color="error"
              variant="text"
              @click="showAddKeyboardDialog = false"
            >
              {{ $t("main.cancel") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Keyboard Panel -->
      <v-row v-if="compactView === false">
        <h1 class="v-label">{{ $t("main.keyboardpanel_header") }}</h1>
      </v-row>
      <v-row
        v-if="keyboard.length > 0"
        id="keyboardpanel"
        ref="keyboardpanel"
      >
        <div
          v-for="(c, index) in keyboard"
          :key="`char-${c.id}-${index}`"
        >
          <div v-if="c.info">
            <button
              :id="c.id"
              type="button"
              class="nocap key"
              :class="{ serifStyle: displaySerif, sansStyle: displaySans }"
              :title="c.info"
              tabindex="0"
              @click="charTapped"
            >
              {{ c.name }}
            </button>
          </div>
          <div v-else>
            <button
              :id="c.id"
              type="button"
              class="nocap key"
              :class="{ serifStyle: displaySerif, sansStyle: displaySans }"
              tabindex="0"
              @click="charTapped"
            >
              {{ c.name }}
            </button>
          </div>
        </div>
      </v-row>
      <v-row v-else>
        <p>{{ $t("main.keyboardpanel_nochars") }}</p>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import type {
  Character,
  StringLatinModelService,
} from "@/api/StringLatinModelService";

import {
  mdiClose,
  mdiContentCopy,
  mdiKeyboardReturn,
  mdiMagnify,
  mdiPlus,
} from "@mdi/js";
import Graphemer from "graphemer";
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { KiwiError, Levels } from "@/api/error";
import FocusUtils from "@/api/FocusUtils";
import { getModel } from "@/api/StringLatinModelService";
import { useThemeStore } from "@/stores/theme";

const props = defineProps<{
  model: StringLatinModelService;
}>();

const { t, locale } = useI18n();
const themeStore = useThemeStore();

// Watch for language changes and update keyboard names
watch(locale, () => {
  themeStore.$patch((state) => {
    state.availableKeyboards = state.availableKeyboards.map((keyboard) => ({
      id: keyboard.id,
      name:
        keyboard.id === "characters-DIN-SPEC-91379"
          ? t("main.keyboards.din")
          : t("main.keyboards.german"),
    }));
  });
});

interface KeyboardInfo {
  id: string;
  name: string;
}

interface LocalProfile {
  seq: number;
  id: string;
  name: string;
  descr: string;
}

interface DisplayCharacter {
  id: string;
  name: string;
  info: string;
}

// Centralize filter state
const currentFilters = reactive({
  cases: themeStore.filterCases,
  profile: themeStore.filterProfile,
  basechar: "",
  searchChar: "",
});

// State
const mainbufferValue = ref("");
const keyboard = ref<DisplayCharacter[]>([]);
const profiles = ref<LocalProfile[]>([]);
const replaceLastGraphme = ref(false);
const numSearches = ref(0);
const splitter = new Graphemer();

// Computed
const compactView = computed(() => themeStore.compactView);
const automaticFocus = computed(() => themeStore.automaticFocus);
const displaySerif = computed(() => themeStore.displaySerif);
const displaySans = computed(() => !displaySerif.value);
const featureBasechar = computed(() => themeStore.feature.basechar);

const inputValue = computed(() => mainbufferValue.value);
const updateInputValue = (value: string) => {
  mainbufferValue.value = value;
};

interface CaseOption {
  seq: number;
  id: string;
  name: string;
  descr: string;
}

const caseing: CaseOption[] = [
  {
    seq: 0,
    id: "s",
    name: "main.cases.standard",
    descr: "main.cases.standard_desc",
  },
  {
    seq: 1,
    id: "g",
    name: "main.cases.capital",
    descr: "main.cases.capital_desc",
  },
  { seq: 2, id: "k", name: "main.cases.small", descr: "main.cases.small_desc" },
  {
    seq: 3,
    id: "gk",
    name: "main.cases.mixed",
    descr: "main.cases.mixed_desc",
  },
];

// Methods
const getProfileName = (id: string | undefined): string => {
  if (!id) return "";
  const key = `main.profiles.${id}`;
  return t(key) || id;
};

const updateCase = (newValue: string): void => {
  if (!newValue || newValue === currentFilters.cases) return;
  currentFilters.cases = newValue;
  themeStore.updateFilterCases(newValue);
  nextTick(() => runSearch());
};

const updateProfile = (newValue: string): void => {
  if (!newValue || newValue === currentFilters.profile) return;
  currentFilters.profile = newValue;
  themeStore.updateFilterProfile(newValue);
  nextTick(() => runSearch());
};

const resetAllFilters = (): void => {
  Object.assign(currentFilters, {
    cases: "s",
    profile: "__all",
    basechar: "",
    searchChar: "",
  });

  themeStore.updateFilterProfile(currentFilters.profile);
  themeStore.updateFilterCases(currentFilters.cases);
  nextTick(() => runSearch());
};

const runSearch = async (): Promise<void> => {
  console.debug("runSearch()");

  try {
    const cases = await mapCharCases();
    const result = await props.model.getFilteredChars(
      currentFilters.profile,
      currentFilters.basechar,
      "",
      cases
    );

    // Transform Character to DisplayCharacter
    keyboard.value = result.map((char) => ({
      id: char.id,
      name: char.name,
      info:
        char.info[locale.value] ||
        char.info["en"] ||
        Object.values(char.info)[0],
    }));

    // Focus (only) at application startup the mainbuffer not the keyboard
    if (numSearches.value++ > 0) {
      nextTick(() => {
        if (automaticFocus.value === true) {
          const firstKeyElem = getFirstKeyboardKey();
          if (firstKeyElem) {
            console.debug("Focusing first key.");
            FocusUtils.focus(firstKeyElem, FocusUtils.RENDER_DELAY_SHORT);
          }
        }
      });
    }
  } catch (error) {
    console.error("Failed to run search:", error);
    keyboard.value = [];
  }
};

const mapCharCases = async (): Promise<string> => {
  const cases = currentFilters.cases;
  if (cases === "g") {
    return "capital";
  } else if (cases === "k") {
    return "small";
  } else if (cases === "gk") {
    return "";
  } else {
    // Default: 's' - like search char
    if (currentFilters.searchChar) {
      const casing = await props.model.getCaseOfChar(currentFilters.searchChar);
      if (casing === "capital" || casing === "small") {
        return casing;
      }
    }
    return "";
  }
};

const searchBaseChar = async (): Promise<void> => {
  if (!mainbufferValue.value.trim()) {
    // Reset search when input is empty
    currentFilters.basechar = "";
    currentFilters.searchChar = "";
    replaceLastGraphme.value = false;
    await runSearch();
    return;
  }

  // Get the last character from the input
  const lastChar = mainbufferValue.value.slice(-1);
  if (!lastChar) {
    // Reset search if no last character
    currentFilters.basechar = "";
    currentFilters.searchChar = "";
    replaceLastGraphme.value = false;
    await runSearch();
    return;
  }

  console.debug('searchBaseChar(): searching for "' + lastChar + '"');
  currentFilters.searchChar = lastChar;

  try {
    const baseChars = await props.model.getBasecharByChar(
      currentFilters.searchChar
    );
    console.debug(
      'searchBaseChar(): baseChars = "' + baseChars.join(", ") + '"'
    );

    if (baseChars.length > 0) {
      // Use the first base character for filtering, but show all in the UI
      currentFilters.basechar = baseChars[0];
      replaceLastGraphme.value = true;
      if (baseChars.length > 1) {
        themeStore.showMessage({
          message: t("main.multiple_base_chars_found", {
            chars: baseChars.join(", "),
          }),
          level: Levels.INFO,
          timeout: 5000,
        });
      }
      await runSearch();
    }
  } catch (error) {
    console.error("Error searching for base character:", error);
    // Reset search on error
    currentFilters.basechar = "";
    currentFilters.searchChar = "";
    replaceLastGraphme.value = false;
    await runSearch();
  }
};

const getMainBufferInputElem = (): HTMLInputElement | null => {
  const field = document.getElementById("mainbuffer");
  if (!field) return null;
  return field.querySelector("input.v-field__input") as HTMLInputElement;
};

const getBufferSelection = (): { start: number; end: number } => {
  const inputElem = getMainBufferInputElem();
  if (!inputElem) return { start: 0, end: 0 };

  const startIdx = inputElem.selectionStart;
  const endIdx = inputElem.selectionEnd;

  // Check if you've selected text
  if (startIdx === endIdx) {
    console.debug(
      "The position of the cursor is (" +
        startIdx +
        "/" +
        inputElem.value.length +
        ")"
    );
  } else {
    console.debug(
      "Detected selection [ " +
        startIdx +
        " , " +
        endIdx +
        " [ of " +
        inputElem.value.length +
        " chars."
    );
  }

  return {
    start: startIdx === null ? 0 : startIdx,
    end: endIdx === null ? 0 : endIdx,
  };
};

const copyToClipboard = async (): Promise<void> => {
  if (!mainbufferValue.value) {
    themeStore.showMessage({
      message: t("main.clipboard_message_failure"),
      level: Levels.ERROR,
      timeout: 3000,
    });
    return;
  }

  try {
    const normalized = mainbufferValue.value.normalize("NFC");
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(normalized);
      themeStore.showMessage({
        message: t("main.clipboard_message"),
        level: Levels.SUCCESS,
        timeout: 3000,
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = normalized;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        themeStore.showMessage({
          message: t("main.clipboard_message"),
          level: Levels.SUCCESS,
          timeout: 3000,
        });
      } catch (err) {
        themeStore.showMessage({
          message: t("main.clipboard_message_too_old"),
          level: Levels.ERROR,
          timeout: 5000,
        });
      }
      document.body.removeChild(textArea);
    }
  } catch (error) {
    themeStore.showMessage({
      message: t("main.clipboard_message_failure"),
      level: Levels.ERROR,
      timeout: 5000,
    });
  }
};

const charTapped = (e: MouseEvent): void => {
  const target = e.target as HTMLButtonElement;
  const c = target.textContent || "";
  console.debug("Char " + c + " tapped.");

  const selection = getBufferSelection();
  const model = mainbufferValue.value;

  if (replaceLastGraphme.value === true) {
    const graphemes = splitter.splitGraphemes(model);
    const grapheme = graphemes.slice(-1)[0];
    mainbufferValue.value = model.slice(0, model.length - grapheme.length) + c;
  } else {
    // Always append to the end if no selection
    mainbufferValue.value = model + c;
  }

  replaceLastGraphme.value = false;

  // Focus management
  nextTick(() => {
    const inputElem = getMainBufferInputElem();
    if (inputElem && automaticFocus.value) {
      const newPos = mainbufferValue.value.length;
      inputElem.selectionStart = newPos;
      inputElem.selectionEnd = newPos;
      FocusUtils.focus(inputElem, FocusUtils.RENDER_DELAY);
    }
  });
};

const clearbuffer = (): void => {
  mainbufferValue.value = "";
  currentFilters.basechar = "";
  currentFilters.searchChar = "";
  nextTick(() => runSearch());
};

// Keyboard selection state
const showAddKeyboardDialog = ref(false);
const selectedKeyboardToAdd = ref("");
const selectedKeyboards = computed({
  get: () => themeStore.selectedKeyboards,
  set: (value) => themeStore.updateSelectedKeyboards(value),
});
const availableKeyboards = computed({
  get: () => themeStore.availableKeyboards,
  set: (value) => themeStore.updateAvailableKeyboards(value),
});
const availableKeyboardFiles: KeyboardInfo[] = [
  { id: "characters-DIN-SPEC-91379", name: t("main.keyboards.din") },
  { id: "characters-german", name: t("main.keyboards.german") },
];

// Computed property for available keyboard options in select
const availableKeyboardOptions = computed(() => {
  return availableKeyboardFiles.filter(
    (keyboard) =>
      !availableKeyboards.value.some((added) => added.id === keyboard.id)
  );
});

// Computed properties for sorted keyboards
const sortedAvailableKeyboards = computed(() => {
  // First, sort all keyboards alphabetically by name
  const sorted = [...availableKeyboards.value].sort((a, b) => {
    // If one of them is DIN SPEC, it should be first
    if (a.id === "characters-DIN-SPEC-91379") return -1;
    if (b.id === "characters-DIN-SPEC-91379") return 1;
    // Otherwise, sort alphabetically by name
    return a.name.localeCompare(b.name);
  });
  return sorted;
});

// Keyboard selection methods
const toggleKeyboard = async (keyboardId: string): Promise<void> => {
  if (selectedKeyboards.value.includes(keyboardId)) {
    // Don't allow deselecting if it's the last selected keyboard
    if (selectedKeyboards.value.length > 1) {
      // Update store directly
      themeStore.$patch((state) => {
        state.selectedKeyboards = state.selectedKeyboards.filter(
          (id) => id !== keyboardId
        );
      });
    } else {
      themeStore.showMessage({
        message: t("main.cannot_deselect_last_keyboard"),
        level: Levels.WARNING,
        timeout: 3000,
      });
      return;
    }
  } else {
    // Update store directly
    themeStore.$patch((state) => {
      state.selectedKeyboards = [...state.selectedKeyboards, keyboardId];
    });
  }
  await props.model.loadKeyboards(selectedKeyboards.value);
  await runSearch();
};

const addKeyboard = async (): Promise<void> => {
  if (
    selectedKeyboardToAdd.value &&
    !availableKeyboards.value.find(
      (k: KeyboardInfo) => k.id === selectedKeyboardToAdd.value
    )
  ) {
    const keyboardId = selectedKeyboardToAdd.value;
    const keyboardName =
      keyboardId === "characters-DIN-SPEC-91379"
        ? t("main.keyboards.din")
        : t("main.keyboards.german");

    // Update store directly
    themeStore.$patch((state) => {
      // Add the new keyboard
      const newKeyboard = { id: keyboardId, name: keyboardName };
      state.availableKeyboards = [...state.availableKeyboards, newKeyboard];
      state.selectedKeyboards = [...state.selectedKeyboards, keyboardId];
    });
    await props.model.loadKeyboards(selectedKeyboards.value);
    await runSearch();
  }
  showAddKeyboardDialog.value = false;
  selectedKeyboardToAdd.value = "";
};

const removeKeyboard = async (keyboardId: string): Promise<void> => {
  // Don't allow removing the last keyboard
  if (availableKeyboards.value.length > 1) {
    // Update store directly
    themeStore.$patch((state) => {
      state.availableKeyboards = state.availableKeyboards.filter(
        (k) => k.id !== keyboardId
      );
      if (state.selectedKeyboards.includes(keyboardId)) {
        state.selectedKeyboards = state.selectedKeyboards.filter(
          (id) => id !== keyboardId
        );
      }
    });
    await props.model.loadKeyboards(selectedKeyboards.value);
    await runSearch();
  } else {
    themeStore.showMessage({
      message: t("main.cannot_remove_last_keyboard"),
      level: Levels.WARNING,
      timeout: 3000,
    });
  }
};

const getFirstKeyboardKey = (): HTMLElement | null => {
  return document.querySelector("#keyboardpanel button");
};

const resetKeyboards = async (): Promise<void> => {
  // Update store directly
  themeStore.$patch((state) => {
    state.availableKeyboards = [
      {
        id: "characters-DIN-SPEC-91379",
        name: t("main.keyboards.din"),
      },
    ];
    state.selectedKeyboards = ["characters-DIN-SPEC-91379"];
  });
  await props.model.loadKeyboards(selectedKeyboards.value);
  await runSearch();
};

// Initialize
onMounted(async (): Promise<void> => {
  // Event listeners
  window.addEventListener("keyup", (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.keyCode === 67) {
      event.preventDefault();
      copyToClipboard();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.keyCode === 32) {
      event.preventDefault();
      searchBaseChar();
      return;
    }
  });

  try {
    // Initialize available keyboards if none are stored
    if (availableKeyboards.value.length === 0) {
      // Update store directly with translated names
      themeStore.$patch((state) => {
        state.availableKeyboards = [
          { id: "characters-DIN-SPEC-91379", name: t("main.keyboards.din") },
          { id: "characters-german", name: t("main.keyboards.german") },
        ];
      });
    }

    // Load the selected keyboards
    if (selectedKeyboards.value.length === 0) {
      // If no keyboards are selected, select the DIN keyboard by default
      themeStore.$patch((state) => {
        state.selectedKeyboards = ["characters-DIN-SPEC-91379"];
      });
    }
    await props.model.loadKeyboards(selectedKeyboards.value);

    const result = await props.model.getAllProfiles();
    // Transform Profile to LocalProfile
    profiles.value = result.map((p) => ({
      seq: p.seq,
      id: p.id,
      name: p.names[locale.value] || p.names["en"] || Object.values(p.names)[0],
      descr:
        p.descriptions[locale.value] ||
        p.descriptions["en"] ||
        Object.values(p.descriptions)[0],
    }));
    await runSearch();
  } catch (error) {
    console.error("Failed to initialize:", error);
    profiles.value = [];
  }
});
</script>

<style scoped>
.sticky {
  position: sticky;
  top: 0;
  z-index: 2;
}

.nocap {
  text-transform: none !important;
}

.key {
  margin: 2px;
  padding: 8px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.key:hover {
  background-color: var(--vp-c-gray-light-4);
  border-color: var(--vp-c-gray);
  box-shadow: var(--vp-shadow-1);
}

.key:focus {
  outline: none;
  border-color: var(--v-primary-base);
  box-shadow: 0 0 0 2px rgba(var(--v-primary-base), 0.2);
}

.serifStyle {
  font-family: "Times New Roman", Times, serif;
}

.sansStyle {
  font-family: Arial, Helvetica, sans-serif;
}

.hyphen {
  hyphens: auto;
}
</style>
