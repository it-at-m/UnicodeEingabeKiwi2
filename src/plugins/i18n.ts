import { createI18n } from "vue-i18n";

import de from "@/locales/de.json?raw";
import en from "@/locales/en.json?raw";

// Get the stored language or default to German
const storedLanguage = localStorage.getItem("language") || "de";

// Parse JSON files
const enMessages = JSON.parse(en);
const deMessages = JSON.parse(de);

// Function to flatten messages object
function flattenMessages(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
    const pre = prefix.length ? prefix + "." : "";
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      Object.assign(
        acc,
        flattenMessages(obj[key] as Record<string, unknown>, pre + key)
      );
    } else {
      acc[pre + key] = String(obj[key]);
    }
    return acc;
  }, {});
}

// Flatten messages
const flatEn = flattenMessages(enMessages);
const flatDe = flattenMessages(deMessages);

// Create i18n instance with type-safe options
const i18n = createI18n({
  legacy: false, // You must set `false`, to use Composition API
  globalInjection: true, // Make translation functions available in template
  locale: storedLanguage,
  fallbackLocale: "en",
  messages: {
    en: flatEn,
    de: flatDe,
  },
  allowComposition: true,
  warnHtmlMessage: false,
  missingWarn: false,
  fallbackWarn: false,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
});

export default i18n;
