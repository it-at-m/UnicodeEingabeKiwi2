/**
 * Per-locale DIN character subsets (generated; see scripts/generate-din-locale-files.py).
 * The full normative set remains in characters-DIN-SPEC-91379.json.
 */
import localeAt from "@/data/characters-din-locales/at.json";
import localeCs from "@/data/characters-din-locales/cs.json";
import localeDa from "@/data/characters-din-locales/da.json";
import localeDe from "@/data/characters-din-locales/de.json";
import localeEs from "@/data/characters-din-locales/es.json";
import localeEt from "@/data/characters-din-locales/et.json";
import localeFi from "@/data/characters-din-locales/fi.json";
import localeFr from "@/data/characters-din-locales/fr.json";
import localeHr from "@/data/characters-din-locales/hr.json";
import localeHu from "@/data/characters-din-locales/hu.json";
import localeIe from "@/data/characters-din-locales/ie.json";
import localeIndex from "@/data/characters-din-locales/index.json";
import localeIs from "@/data/characters-din-locales/is.json";
import localeIt from "@/data/characters-din-locales/it.json";
import localeLt from "@/data/characters-din-locales/lt.json";
import localeLv from "@/data/characters-din-locales/lv.json";
import localeMt from "@/data/characters-din-locales/mt.json";
import localeNl from "@/data/characters-din-locales/nl.json";
import localeNo from "@/data/characters-din-locales/no.json";
import localePl from "@/data/characters-din-locales/pl.json";
import localePt from "@/data/characters-din-locales/pt.json";
import localeRo from "@/data/characters-din-locales/ro.json";
import localeSe from "@/data/characters-din-locales/se.json";
import localeSk from "@/data/characters-din-locales/sk.json";
import localeSl from "@/data/characters-din-locales/sl.json";
import localeTr from "@/data/characters-din-locales/tr.json";
import localeWel from "@/data/characters-din-locales/wel.json";

export interface DinLocaleFile {
  id: string;
  names: Record<string, string>;
  countryCodes: string[];
  characters: Array<{ id: string }>;
}

export const DIN_LOCALE_INDEX = localeIndex;

export const DIN_LOCALE_FILES: Record<string, DinLocaleFile> = {
  "locale-at": localeAt as DinLocaleFile,
  "locale-cs": localeCs as DinLocaleFile,
  "locale-da": localeDa as DinLocaleFile,
  "locale-de": localeDe as DinLocaleFile,
  "locale-es": localeEs as DinLocaleFile,
  "locale-et": localeEt as DinLocaleFile,
  "locale-fi": localeFi as DinLocaleFile,
  "locale-fr": localeFr as DinLocaleFile,
  "locale-hr": localeHr as DinLocaleFile,
  "locale-hu": localeHu as DinLocaleFile,
  "locale-ie": localeIe as DinLocaleFile,
  "locale-is": localeIs as DinLocaleFile,
  "locale-it": localeIt as DinLocaleFile,
  "locale-lt": localeLt as DinLocaleFile,
  "locale-lv": localeLv as DinLocaleFile,
  "locale-mt": localeMt as DinLocaleFile,
  "locale-nl": localeNl as DinLocaleFile,
  "locale-no": localeNo as DinLocaleFile,
  "locale-pl": localePl as DinLocaleFile,
  "locale-pt": localePt as DinLocaleFile,
  "locale-ro": localeRo as DinLocaleFile,
  "locale-se": localeSe as DinLocaleFile,
  "locale-sk": localeSk as DinLocaleFile,
  "locale-sl": localeSl as DinLocaleFile,
  "locale-tr": localeTr as DinLocaleFile,
  "locale-wel": localeWel as DinLocaleFile,
};

/** Character ids allowed per locale profile (for filtering the master DIN keyboard). */
export function buildDinLocaleIdSets(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const [localeId, file] of Object.entries(DIN_LOCALE_FILES)) {
    map.set(localeId, new Set(file.characters.map((c) => c.id)));
  }
  return map;
}

export function isDinLocaleProfile(profileId: string): boolean {
  return profileId.startsWith("locale-");
}
