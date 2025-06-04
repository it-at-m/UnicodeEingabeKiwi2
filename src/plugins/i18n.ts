import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import de from '@/locales/de.json'

// Get the stored language or default to German
const storedLanguage = localStorage.getItem('language') || 'de'

export default createI18n({
  legacy: false,
  locale: storedLanguage,
  fallbackLocale: 'en',
  messages: {
    en,
    de
  },
  allowComposition: true,
  warnHtmlMessage: false
}) 