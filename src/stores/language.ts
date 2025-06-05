import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useLanguageStore = defineStore('language', () => {
  const locale = ref(localStorage.getItem('language') || 'de')
  
  watch(locale, (newValue) => {
    localStorage.setItem('language', newValue)
  })

  return {
    locale
  }
}) 