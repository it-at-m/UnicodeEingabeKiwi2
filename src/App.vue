<template>
  <v-app
    :theme="theme"
    :class="{ dark: themeStore.isDark }"
  >
    <TheSnackbar />
    <v-app-bar
      :color="theme === 'light' ? 'white' : 'grey-darken-3'"
      elevation="1"
      class="app-bar"
    >
      <v-app-bar-nav-icon
        :color="theme === 'light' ? 'primary' : 'white'"
        @click.stop="toggleDrawer()"
      />
      <router-link
        to="/"
        class="app-bar__brand text-decoration-none"
      >
        <v-img
          src="/images/Kiwi-Bird-Logo.svg"
          alt="Kiwi Logo"
          width="40"
          height="40"
          max-width="40"
          class="app-bar__logo mr-2"
          :class="{ 'invert-black-white': theme === 'dark' }"
        />
        <div class="app-bar__title text-no-wrap font-weight-bold">
          <span
            class="app-bar__title-full"
            :class="theme === 'light' ? 'text-primary' : 'text-white'"
          >
            <span>Unicode</span>
            <span class="text-secondary">Eingabe</span>
            <span>Kiwi</span>
          </span>
          <span
            class="app-bar__title-short"
            :class="theme === 'light' ? 'text-primary' : 'text-white'"
            >Kiwi</span
          >
        </div>
      </router-link>
      <v-spacer class="app-bar__spacer" />
      <div class="app-bar__actions">
        <VPSwitchAppearance
          class="mr-2"
          :is-dark="themeStore.isDark"
          @update:is-dark="setThemeDark"
        />
        <VPNavBarTranslations />
        <VPSocialLink
          :href="URL_DIN_SPEC_91379_WIKI"
          :icon="mdiWikipedia"
          :title="$t('settings.din_spec')"
        />
        <VPSocialLink
          :href="URL_GITHUB_REPO"
          :title="$t('settings.github_alt')"
        />
        <a
          href="https://www.muenchen.de/"
          target="_blank"
          rel="noopener noreferrer"
          class="app-bar__lhm-link"
        >
          <v-img
            src="https://assets.muenchen.de/logos/lhm/logo-lhm-muenchen.svg"
            alt="LHM Logo"
            width="150"
            min-width="100"
            max-width="200"
            class="ml-2"
            :class="{ 'invert-colors': theme === 'dark' }"
          />
        </a>
      </div>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      class="app-drawer"
      :width="270"
    >
      <v-list>
        <v-list-item :to="{ name: ROUTES_HELP }">
          <template #prepend>
            <v-icon :icon="mdiHelpCircle"></v-icon>
          </template>
          <v-list-item-title>{{ $t("menu.help") }}</v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: ROUTES_ABOUT }">
          <template #prepend>
            <v-icon :icon="mdiInformation"></v-icon>
          </template>
          <v-list-item-title>{{ $t("menu.about") }}</v-list-item-title>
        </v-list-item>
        <v-list-item
          :href="opensourceUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <template #prepend>
            <v-icon :icon="mdiCodeBraces" />
          </template>
          <v-list-item-title>{{ $t("menu.opensource") }}</v-list-item-title>
        </v-list-item>
        <v-divider class="drawer-divider-mobile my-2" />
        <v-list-item class="drawer-mobile-only">
          <div class="drawer-tools">
            <VPSwitchAppearance
              :is-dark="themeStore.isDark"
              @update:is-dark="setThemeDark"
            />
            <VPNavBarTranslations />
            <VPSocialLink
              :href="URL_DIN_SPEC_91379_WIKI"
              :icon="mdiWikipedia"
              :title="$t('settings.din_spec')"
            />
            <VPSocialLink
              :href="URL_GITHUB_REPO"
              :title="$t('settings.github_alt')"
            />
          </div>
        </v-list-item>
        <div class="drawer-lhm-section drawer-mobile-only">
          <v-divider />
          <a
            href="https://www.muenchen.de/"
            target="_blank"
            rel="noopener noreferrer"
            class="drawer-lhm-link"
          >
            <v-img
              src="https://assets.muenchen.de/logos/lhm/logo-lhm-muenchen.svg"
              alt="LHM Logo"
              width="148"
              max-width="148"
              :class="{ 'invert-colors': theme === 'dark' }"
            />
          </a>
          <v-divider />
        </div>
        <v-divider class="drawer-version-divider my-2" />
        <v-list-item>
          <div class="d-flex justify-center align-center px-2 text-disabled">
            {{ kiwi2Version }}
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import {
  mdiCodeBraces,
  mdiHelpCircle,
  mdiInformation,
  mdiWikipedia,
} from "@mdi/js";
import { useToggle } from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { handleThreadError } from "@/api/error";
import TheSnackbar from "@/components/TheSnackbar.vue";
import VPNavBarTranslations from "@/components/VPNavBarTranslations.vue";
import VPSocialLink from "@/components/VPSocialLink.vue";
import VPSwitchAppearance from "@/components/VPSwitchAppearance.vue";
import {
  ROUTES_ABOUT,
  ROUTES_HELP,
  URL_DIN_SPEC_91379_WIKI,
  URL_GITHUB_REPO,
  URL_OPENSOURCE_KIWI_DE,
  URL_OPENSOURCE_KIWI_EN,
} from "@/constants";
import { useThemeStore } from "@/stores/theme";
import { debug } from "@/utils/debug";
import { applySeo, routeNameToSeoPage } from "@/utils/seo";

const [drawer, toggleDrawer] = useToggle();
const themeStore = useThemeStore();
const theme = computed(() => (themeStore.isDark ? "dark" : "light"));

// Defer theme update to next frame so click returns immediately; avoids blocking when many keys re-render
function setThemeDark(value: boolean) {
  requestAnimationFrame(() => {
    themeStore.isDark = value;
  });
}

const kiwi2Version = ref("");

const route = useRoute();
const { t, locale } = useI18n();
const opensourceUrl = computed(() =>
  locale.value === "de" ? URL_OPENSOURCE_KIWI_DE : URL_OPENSOURCE_KIWI_EN
);

watch(
  [locale, () => route.name],
  () => {
    applySeo(locale.value, routeNameToSeoPage(route.name), t);
  },
  { immediate: true }
);

// Verify translations are working
debug.log("App component translations", {
  currentLocale: locale.value,
  sampleTranslation: t("nav.language"),
  hasTranslation: !!t("nav.language"),
});

onMounted(async () => {
  try {
    const response = await fetch(
      "https://api.github.com/repos/it-at-m/UnicodeEingabeKiwi2/releases/latest"
    );
    if (!response.ok) {
      const body = await response.text();
      console.debug("Release fetch failed", {
        status: response.status,
        statusText: response.statusText,
        body: body.slice(0, 200),
      });
      kiwi2Version.value = "";
      return;
    }
    const data = await response.json();
    kiwi2Version.value = data.tag_name || "";
  } catch (error) {
    handleThreadError(error, themeStore.showMessage);
    kiwi2Version.value = "";
  }
});
</script>

<style>
.main {
  background-color: white;
}

.app-bar__brand {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.app-bar__logo {
  flex: 0 0 40px;
  width: 40px;
  min-width: 40px;
  height: 40px;
}

.app-bar__title {
  font-size: 1.25rem;
  line-height: 1.75rem;
  overflow: visible;
  text-overflow: clip;
}

.app-bar__title-short {
  display: none;
}

.app-bar__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.app-bar__lhm-link {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.drawer-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.drawer-tools .VPSocialLink {
  margin-left: 0;
}

.drawer-lhm-section {
  display: none;
}

.drawer-lhm-section .v-divider {
  margin: 0;
}

.drawer-lhm-link {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 14px 12px;
  text-decoration: none;
}

.drawer-lhm-link .v-img {
  flex: 0 0 auto;
}

.drawer-mobile-only,
.drawer-divider-mobile {
  display: none;
}

@media (max-width: 775px) {
  .app-bar__title-full {
    display: none;
  }

  .app-bar__title-short {
    display: inline;
  }
}

@media (max-width: 650px) {
  .app-bar__spacer,
  .app-bar__actions {
    display: none;
  }

  .drawer-mobile-only {
    display: list-item;
  }

  .drawer-divider-mobile {
    display: block;
  }

  .drawer-lhm-section {
    display: block;
  }

  .drawer-version-divider {
    display: none;
  }
}

.invert-colors {
  filter: invert(1) brightness(100%);
}

.invert-black-white {
  filter: invert(1) hue-rotate(0deg) brightness(100%) saturate(0%);
}

/* Theme transition on main layout */
.v-application,
.v-app-bar,
.v-main,
.v-navigation-drawer {
  transition:
    background-color 100ms ease-in-out,
    color 100ms ease-in-out;
}

:root {
  --vp-c-bg-soft: #f9f9f9;
  --vp-c-divider: #e2e2e2;
  --vp-c-gray: #8e8e8e;
  --vp-c-text-2: #454545;
  --vp-c-gray-light-4: #ffffff;
  --vp-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.dark {
  --vp-c-bg-soft: #2c2c2c;
  --vp-c-divider: #3a3a3a;
  --vp-c-gray: #757575;
  --vp-c-text-2: #a8a8a8;
  --vp-c-gray-light-4: #3a3a3a;
  --vp-shadow-1: 0 1px 2px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
