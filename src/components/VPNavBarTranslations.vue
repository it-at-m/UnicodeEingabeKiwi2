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

const { locale: i18nLocale } = useI18n()
const languageStore = useLanguageStore()

const currentLocale = computed(() => languageStore.locale)

const availableLocales = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' }
]

function switchLocale(localeCode: string) {
  i18nLocale.value = localeCode
  languageStore.locale = localeCode
}
</script>

<style scoped>
.VPNavBarTranslations {
  display: flex;
  align-items: center;
  margin-left: 8px;
}
</style> 