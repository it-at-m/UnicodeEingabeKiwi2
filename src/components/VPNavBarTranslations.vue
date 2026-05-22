<template>
  <div class="VPNavBarTranslations">
    <v-menu>
      <template #activator="{ props: menuProps }">
        <button
          type="button"
          class="locale-activator"
          v-bind="menuProps"
          :title="$t('nav.switchLocale')"
        >
          <v-icon
            :icon="mdiTranslate"
            size="20"
            class="locale-activator__icon"
          />
          <span class="locale-activator__label">{{
            currentLocale === "de" ? "DE" : "EN"
          }}</span>
        </button>
      </template>
      <v-list density="compact">
        <v-list-item
          v-for="locale in availableLocales"
          :key="locale.code"
          :value="locale.code"
          @click="switchLocale(locale.code)"
        >
          <v-list-item-title>{{ locale.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { mdiTranslate } from "@mdi/js";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { useLanguageStore } from "@/stores/language";
import { debug } from "@/utils/debug";

const { locale: i18nLocale } = useI18n();
const languageStore = useLanguageStore();

const currentLocale = computed(() => languageStore.locale);

// Debug logging for translation loading
const i18n = useI18n();
debug.log("Translation component state", {
  currentLocale: currentLocale.value,
  i18nLocale: i18nLocale.value,
  availableMessages: i18n.messages.value,
});

const availableLocales = [
  { code: "de", name: "Deutsch" },
  { code: "en", name: "English" },
];

function switchLocale(localeCode: string) {
  debug.log("Switching locale", {
    from: i18nLocale.value,
    to: localeCode,
    currentMessages: i18n.messages.value,
  });
  i18nLocale.value = localeCode;
  languageStore.locale = localeCode;
  debug.log("Locale switched", {
    newLocale: i18nLocale.value,
    storeLocale: languageStore.locale,
    messages: i18n.messages.value,
  });
}
</script>

<style scoped>
.VPNavBarTranslations {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

/* Plain button avoids Vuetify 4 v-btn hover transforms on the translate icon */
.locale-activator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  height: 40px;
  padding: 0 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  vertical-align: middle;
}

.locale-activator:hover {
  background: rgba(var(--v-theme-on-surface), 0.08);
}

.locale-activator__label {
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1;
}

.locale-activator__icon {
  flex-shrink: 0;
}

.locale-activator__icon :deep(.v-icon__svg),
.locale-activator__icon :deep(svg) {
  transform: none !important;
  transition: none !important;
}
</style>
