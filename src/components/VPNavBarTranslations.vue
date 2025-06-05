<template>
  <div class="VPNavBarTranslations">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          class="text-none"
          :prepend-icon="mdiTranslate"
        >
          {{ currentLocale === 'de' ? 'DE' : 'EN' }}
        </v-btn>
      </template>
      <v-list>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { mdiTranslate } from '@mdi/js'
import { useLanguageStore } from '@/stores/language'
import { debug } from '@/utils/debug'

const { locale: i18nLocale } = useI18n()
const languageStore = useLanguageStore()

const currentLocale = computed(() => languageStore.locale)

// Debug logging for translation loading
const i18n = useI18n()
debug.log('Translation component state', {
  currentLocale: currentLocale.value,
  i18nLocale: i18nLocale.value,
  availableMessages: i18n.messages.value
})

const availableLocales = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' }
]

function switchLocale(localeCode: string) {
  debug.log('Switching locale', {
    from: i18nLocale.value,
    to: localeCode,
    currentMessages: i18n.messages.value
  })
  i18nLocale.value = localeCode
  languageStore.locale = localeCode
  debug.log('Locale switched', {
    newLocale: i18nLocale.value,
    storeLocale: languageStore.locale,
    messages: i18n.messages.value
  })
}
</script>

<style scoped>
.VPNavBarTranslations {
  display: flex;
  align-items: center;
  margin-left: 8px;
}
</style> 