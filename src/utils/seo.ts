import type { ComposerTranslation } from "vue-i18n";

import { ROUTES_ABOUT, ROUTES_HELP } from "@/constants";

export type SeoPage = "home" | "help" | "about";

function setMetaName(name: string, content: string): void {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaProperty(property: string, content: string): void {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function titleKey(page: SeoPage): string {
  if (page === "help") return "seo.titleHelp";
  if (page === "about") return "seo.titleAbout";
  return "seo.title";
}

export function routeNameToSeoPage(
  routeName: string | symbol | null | undefined
): SeoPage {
  if (routeName === ROUTES_HELP) return "help";
  if (routeName === ROUTES_ABOUT) return "about";
  return "home";
}

export function applySeo(
  locale: string,
  page: SeoPage,
  t: ComposerTranslation
): void {
  const lang = locale === "de" ? "de" : "en";
  document.documentElement.lang = lang;

  const title = t(titleKey(page));
  const description = t("seo.description");
  const keywords = t("seo.keywords");

  document.title = title;
  setMetaName("description", description);
  setMetaName("keywords", keywords);
  setMetaProperty("og:title", title);
  setMetaProperty("og:description", description);
  setMetaProperty("og:locale", lang === "de" ? "de_DE" : "en_US");
}
