<template>
  <div ref="mainViewRef">
    <v-container fluid>
      <!-- Buffer Panel -->
      <v-row v-if="!compactView">
        <h1 class="v-label">{{ $t("main.bufferpanel_header") }}</h1>
      </v-row>
      <v-row
        id="bufferpanel"
        :class="{ sticky: showBufferFieldAppend }"
        align="center"
      >
        <v-col class="mb-4 buffer-panel">
          <v-text-field
            id="mainbuffer"
            ref="mainbuffer"
            :model-value="inputValue"
            class="nocap buffer-panel__field sansStyle"
            :label="bufferLabel"
            variant="filled"
            :density="bufferFieldDensity"
            bg-color="white"
            @update:model-value="updateInputValue"
            @keyup.enter.exact="searchBaseChar"
          >
            <template
              v-if="showBufferFieldAppend"
              #append
            >
              <div class="buffer-panel__append">
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
                >
                  <v-icon :icon="mdiMagnify"></v-icon>
                </v-btn>
                <v-btn
                  id="copytobutton"
                  icon
                  :title="$t('main.clipboard_copy_alt')"
                  @click="copyToClipboard"
                >
                  <v-icon :icon="mdiContentCopy"></v-icon>
                </v-btn>
              </div>
            </template>
          </v-text-field>
          <div
            v-show="!showBufferFieldAppend"
            class="buffer-panel__actions-mobile d-flex"
          >
            <v-btn
              id="clearbufferbutton"
              variant="outlined"
              density="compact"
              class="buffer-panel__action-btn"
              :title="$t('main.mainbuffer_alt')"
              @click="clearbuffer"
            >
              <v-icon :icon="mdiClose" />
            </v-btn>
            <v-btn
              id="searchcharbutton"
              variant="outlined"
              density="compact"
              class="buffer-panel__action-btn"
              :title="$t('main.search_char_alt')"
              @click="searchBaseChar"
            >
              <v-icon :icon="mdiMagnify" />
            </v-btn>
            <v-btn
              id="copytobutton"
              variant="outlined"
              density="compact"
              class="buffer-panel__action-btn"
              :title="$t('main.clipboard_copy_alt')"
              @click="copyToClipboard"
            >
              <v-icon :icon="mdiContentCopy" />
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Filter Panel (always visible; headings only in non-compact layout) -->
      <v-row v-if="!compactView">
        <h1 class="v-label">{{ $t("main.filterpanel_header") }}</h1>
      </v-row>
      <v-row
        id="filterpanel"
        class="filter-panel"
        align="baseline"
      >
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
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
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-select
            id="filterregion"
            :model-value="currentFilters.profile"
            class="nocap"
            :label="$t('main.filterregion')"
            :title="$t('main.filterregion_alt')"
            :items="profiles"
            :item-title="(item) => item.name"
            item-value="id"
            hide-details="auto"
            @update:model-value="updateProfile"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-select
            id="filterlocale"
            :model-value="currentFilters.locale"
            class="nocap"
            :label="$t('main.filterlanguage')"
            :title="$t('main.filterlanguage_alt')"
            :items="localeProfiles"
            :item-title="(item) => item.name"
            item-value="id"
            :menu-props="{ maxHeight: 360 }"
            hide-details="auto"
            @update:model-value="updateLocale"
          />
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="3"
          class="filter-panel__actions d-flex align-self-center"
        >
          <v-btn
            id="resetallfilters"
            class="filter-panel__reset nocap hyphen"
            :title="$t('main.filterresetall_alt')"
            @click="resetAllFilters"
          >
            {{ $t("main.filterresetall") }}
          </v-btn>
        </v-col>
      </v-row>

      <!-- Keyboard Selection Panel -->
      <v-row v-if="!compactView">
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
              v-if="availableKeyboardOptions.length > 0"
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
      <v-row v-if="!compactView">
        <h1 class="v-label">{{ $t("main.keyboardpanel_header") }}</h1>
      </v-row>
      <v-row
        v-if="keyboard.length > 0"
        id="keyboardpanel"
        ref="keyboardpanel"
        no-gutters
      >
        <div
          v-for="(c, index) in keyboard"
          :key="`char-${c.id}-${index}`"
        >
          <div v-if="c.info">
            <button
              :id="c.id"
              type="button"
              class="nocap key sansStyle"
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
              class="nocap key sansStyle"
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
import type { StringLatinModelService } from "@/api/StringLatinModelService";

import {
  mdiClose,
  mdiContentCopy,
  mdiKeyboardReturn,
  mdiMagnify,
  mdiPlus,
} from "@mdi/js";
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

import { handleThreadError, Levels } from "@/api/error";
import {
  focus as focusUtil,
  RENDER_DELAY,
  RENDER_DELAY_SHORT,
} from "@/api/FocusUtils";
import { KEYBOARD_DIN_91379_ID } from "@/constants";
import { useThemeStore } from "@/stores/theme";
import Graphemer from "@/utils/graphemer";

const props = defineProps<{
  model: StringLatinModelService;
}>();

const { t, locale } = useI18n();
const themeStore = useThemeStore();
const display = useDisplay();
/** Always compact; section headings hidden (settings toggle removed). */
const compactView = true;
const showBufferFieldAppend = computed(() => display.width.value > 500);
const showBufferLabelShort = computed(() => display.width.value <= 700);
const bufferLabel = computed(() =>
  showBufferLabelShort.value
    ? t("main.mainbuffer_label_short")
    : t("main.mainbuffer_label")
);
const bufferFieldDensity = computed(() =>
  showBufferFieldAppend.value ? "compact" : "comfortable"
);

// Watch for language changes and update DIN keyboard label
watch(locale, () => {
  themeStore.$patch((state) => {
    state.availableKeyboards = state.availableKeyboards.map((keyboard) =>
      keyboard.id === KEYBOARD_DIN_91379_ID
        ? { id: keyboard.id, name: t("main.keyboards.din") }
        : keyboard
    );
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

/** Raw profile from model (names/descriptions by locale) for reactive locale display */
interface RawProfile {
  seq: number;
  id: string;
  names: Record<string, string>;
  descriptions: Record<string, string>;
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
  locale: themeStore.filterLocale,
  basechar: "",
  searchChar: "",
});

// State
const mainbufferValue = ref("");
const keyboard = ref<DisplayCharacter[]>([]);
const rawProfiles = ref<RawProfile[]>([]);
const rawLocaleProfiles = ref<RawProfile[]>([]);
const replaceLastGraphme = ref(false);
const numSearches = ref(0);
const splitter = new Graphemer();
const mainViewRef = ref<HTMLElement | null>(null);

const inputValue = computed(() => mainbufferValue.value);
const updateInputValue = (value: string) => {
  mainbufferValue.value = value;
};

// Derive display profiles from raw data and locale so names update on language switch
const profiles = computed<LocalProfile[]>(() =>
  rawProfiles.value.map((p) => ({
    seq: p.seq,
    id: p.id,
    name:
      p.names[locale.value] || p.names["en"] || Object.values(p.names)[0] || "",
    descr:
      p.descriptions[locale.value] ||
      p.descriptions["en"] ||
      Object.values(p.descriptions)[0] ||
      "",
  }))
);

const localeProfiles = computed<LocalProfile[]>(() => {
  const allLanguages: LocalProfile = {
    seq: 0,
    id: "",
    name: t("main.filterlanguage_all"),
    descr: t("main.filterlanguage_all_desc"),
  };
  const mapped = rawLocaleProfiles.value.map((p) => ({
    seq: p.seq,
    id: p.id,
    name:
      p.names[locale.value] || p.names["en"] || Object.values(p.names)[0] || "",
    descr:
      p.descriptions[locale.value] ||
      p.descriptions["en"] ||
      Object.values(p.descriptions)[0] ||
      "",
  }));
  return [allLanguages, ...mapped];
});

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

const updateLocale = (newValue: string): void => {
  const value = newValue ?? "";
  if (value === currentFilters.locale) return;
  currentFilters.locale = value;
  themeStore.updateFilterLocale(value);
  nextTick(() => runSearch());
};

const resetAllFilters = (): void => {
  Object.assign(currentFilters, {
    cases: "s",
    profile: "__all",
    locale: "",
    basechar: "",
    searchChar: "",
  });

  themeStore.updateFilterProfile(currentFilters.profile);
  themeStore.updateFilterCases(currentFilters.cases);
  themeStore.updateFilterLocale(currentFilters.locale);
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
      cases,
      true,
      currentFilters.locale
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
        const firstKeyElem = getFirstKeyboardKey();
        if (firstKeyElem) {
          console.debug("Focusing first key.");
          focusUtil(firstKeyElem, RENDER_DELAY_SHORT);
        }
      });
    }
  } catch (error) {
    handleThreadError(error, themeStore.showMessage);
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

  // Get the last grapheme (handles surrogate pairs / multi-codepoint e.g. emoji)
  const graphemes = splitter.splitGraphemes(mainbufferValue.value);
  const lastChar = graphemes.length > 0 ? graphemes[graphemes.length - 1] : "";
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
    handleThreadError(error, themeStore.showMessage);
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
      } catch {
        themeStore.showMessage({
          message: t("main.clipboard_message_too_old"),
          level: Levels.ERROR,
          timeout: 5000,
        });
      }
      document.body.removeChild(textArea);
    }
  } catch {
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

  const model = mainbufferValue.value;

  if (replaceLastGraphme.value === true) {
    const graphemes = splitter.splitGraphemes(model);
    const grapheme = graphemes.slice(-1)[0];
    if (graphemes.length === 0 || grapheme === undefined) {
      replaceLastGraphme.value = false;
      mainbufferValue.value = model + c;
    } else {
      mainbufferValue.value =
        model.slice(0, model.length - grapheme.length) + c;
    }
  } else {
    // Always append to the end if no selection
    mainbufferValue.value = model + c;
  }

  replaceLastGraphme.value = false;

  // Focus management
  nextTick(() => {
    const inputElem = getMainBufferInputElem();
    if (inputElem) {
      const newPos = mainbufferValue.value.length;
      inputElem.selectionStart = newPos;
      inputElem.selectionEnd = newPos;
      focusUtil(inputElem, RENDER_DELAY);
    }
  });
};

const clearbuffer = (): void => {
  mainbufferValue.value = "";
  currentFilters.basechar = "";
  currentFilters.searchChar = "";
  replaceLastGraphme.value = false;
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
/** Optional extra keyboards (DIN 91379:2022-08 is always the primary dataset). */
const availableKeyboardFiles = computed<KeyboardInfo[]>(() => [
  { id: KEYBOARD_DIN_91379_ID, name: t("main.keyboards.din") },
]);

// Computed property for available keyboard options in select
const availableKeyboardOptions = computed(() => {
  return availableKeyboardFiles.value.filter(
    (keyboard) =>
      !availableKeyboards.value.some((added) => added.id === keyboard.id)
  );
});

// Computed properties for sorted keyboards
const sortedAvailableKeyboards = computed(() => {
  // First, sort all keyboards alphabetically by name
  const sorted = [...availableKeyboards.value].sort((a, b) => {
    // If one of them is DIN SPEC, it should be first
    if (a.id === KEYBOARD_DIN_91379_ID) return -1;
    if (b.id === KEYBOARD_DIN_91379_ID) return 1;
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
    const keyboardName = t("main.keyboards.din");

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
  const isLastSelected =
    selectedKeyboards.value.includes(keyboardId) &&
    selectedKeyboards.value.length === 1;
  const canRemove = availableKeyboards.value.length > 1 && !isLastSelected;

  if (canRemove) {
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
      message: isLastSelected
        ? t("main.cannot_deselect_last_keyboard")
        : t("main.cannot_remove_last_keyboard"),
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
      { id: KEYBOARD_DIN_91379_ID, name: t("main.keyboards.din") },
    ];
    state.selectedKeyboards = [KEYBOARD_DIN_91379_ID];
  });
  await props.model.loadKeyboards(selectedKeyboards.value);
  await runSearch();
};

// Initialize
const onGlobalKeyup = (event: KeyboardEvent): void => {
  const inside = mainViewRef.value?.contains(event.target as Node);
  if (!inside) return;

  if ((event.metaKey || event.ctrlKey) && event.key === "c") {
    event.preventDefault();
    copyToClipboard();
    return;
  }
  if ((event.metaKey || event.ctrlKey) && event.key === " ") {
    event.preventDefault();
    searchBaseChar();
    return;
  }
};

onMounted(async (): Promise<void> => {
  window.addEventListener("keyup", onGlobalKeyup);

  try {
    // Migrate legacy state: single DIN 91379 keyboard (no separate German keyboard)
    themeStore.$patch((state) => {
      const hadGermanKeyboard =
        state.selectedKeyboards.includes("characters-german") ||
        state.availableKeyboards.some((k) => k.id === "characters-german");
      const dinName = t("main.keyboards.din");
      state.selectedKeyboards = [
        ...new Set(
          state.selectedKeyboards
            .filter((id) => id !== "characters-german")
            .map((id) =>
              id === "characters-german" ? KEYBOARD_DIN_91379_ID : id
            )
        ),
      ];
      if (state.selectedKeyboards.length === 0) {
        state.selectedKeyboards = [KEYBOARD_DIN_91379_ID];
      }
      state.availableKeyboards = state.availableKeyboards
        .filter((k) => k.id !== "characters-german")
        .map((k) =>
          k.id === KEYBOARD_DIN_91379_ID ? { id: k.id, name: dinName } : k
        );
      if (
        !state.availableKeyboards.some((k) => k.id === KEYBOARD_DIN_91379_ID)
      ) {
        state.availableKeyboards = [
          { id: KEYBOARD_DIN_91379_ID, name: dinName },
        ];
      }
      // Former "Deutsche Tastatur" users → German DIN language filter
      if (!state.filterLocale && hadGermanKeyboard) {
        state.filterLocale = "locale-de";
        currentFilters.locale = "locale-de";
      }
    });

    await props.model.loadKeyboards(selectedKeyboards.value);

    const [normProfiles, languageProfiles] = await Promise.all([
      props.model.getAllProfiles(),
      props.model.getLocaleProfiles(),
    ]);
    rawProfiles.value = normProfiles;
    rawLocaleProfiles.value = languageProfiles;
    await runSearch();
  } catch (error) {
    handleThreadError(error, themeStore.showMessage);
    rawProfiles.value = [];
    rawLocaleProfiles.value = [];
  }
});

onUnmounted(() => {
  window.removeEventListener("keyup", onGlobalKeyup);
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

.sansStyle {
  font-family: Arial, Helvetica, sans-serif;
}

.hyphen {
  hyphens: auto;
}

.buffer-panel__append {
  display: flex;
  align-items: center;
  gap: 8px;
}

.buffer-panel__actions-mobile {
  gap: 8px;
  margin-top: 8px;
}

@media (max-width: 500px) {
  #bufferpanel .buffer-panel {
    padding-right: 0;
  }

  .buffer-panel__action-btn {
    flex: 1;
    min-width: 0;
    min-height: 48px;
    padding-top: 12px;
    padding-bottom: 12px;
    border-radius: 4px;
  }
}

@media (max-width: 959px) {
  .filter-panel__actions {
    align-self: stretch !important;
  }

  .filter-panel__reset {
    width: 100%;
  }
}

/* Limit repaint/layout when theme or content updates (many keys) */
#keyboardpanel {
  contain: layout paint;
}
</style>
