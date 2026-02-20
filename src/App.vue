<template>
  <v-app
    :theme="theme"
    :class="{ dark: themeStore.isDark }"
  >
    <the-snackbar />
    <v-app-bar
      :color="theme === 'light' ? 'white' : 'grey-darken-3'"
      elevation="1"
    >
      <v-row align="center">
        <v-col
          cols="8"
          sm="9"
          class="d-flex align-center"
        >
          <v-app-bar-nav-icon
            :color="theme === 'light' ? 'primary' : 'white'"
            @click.stop="toggleDrawer()"
          />
          <router-link
            to="/"
            class="d-flex align-center text-decoration-none"
          >
            <v-img
              src="/images/Kiwi-Bird-Logo.svg"
              alt="Kiwi Logo"
              max-width="40"
              class="mr-2"
              :class="{ 'invert-black-white': theme === 'dark' }"
            />
            <!-- Desktop and Tablet View -->
            <v-toolbar-title
              class="text-no-wrap font-weight-bold d-none d-sm-flex"
            >
              <span :class="theme === 'light' ? 'text-primary' : 'text-white'"
                >Unicode</span
              >
              <span class="text-secondary">Eingabe</span>
              <span :class="theme === 'light' ? 'text-primary' : 'text-white'"
                >Kiwi</span
              >
            </v-toolbar-title>
            <!-- Mobile View -->
            <v-toolbar-title class="text-no-wrap font-weight-bold d-sm-none">
              <span :class="theme === 'light' ? 'text-primary' : 'text-white'"
                >Kiwi</span
              >
            </v-toolbar-title>
          </router-link>
        </v-col>
        <v-col
          cols="4"
          sm="3"
          class="d-flex align-center justify-end"
        >
          <div class="d-none d-sm-flex align-center">
            <VPSwitchAppearance
              v-model:isDark="themeStore.isDark"
              class="mr-2"
            />
            <VPNavBarTranslations />
            <VPSocialLink :href="GITHUB_URL" />
          </div>
          <v-img
            src="https://assets.muenchen.de/logos/lhm/logo-lhm-muenchen.svg"
            alt="LHM Logo"
            width="150"
            min-width="100"
            max-width="200"
            class="ml-4 pr-5"
            :class="{ 'invert-colors': theme === 'dark' }"
          />
        </v-col>
      </v-row>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item :to="{ name: ROUTES_HELP }">
          <template #prepend>
            <v-icon :icon="mdiHelpCircle"></v-icon>
          </template>
          <v-list-item-title v-text="$t('menu.help')"></v-list-item-title>
        </v-list-item>
        <v-list-item :to="{ name: ROUTES_ABOUT }">
          <template #prepend>
            <v-icon :icon="mdiInformation"></v-icon>
          </template>
          <v-list-item-title v-text="$t('menu.about')"></v-list-item-title>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item>
          <div class="d-flex align-center px-2">
            <VPSwitchAppearance
              v-model:isDark="themeStore.isDark"
              class="mr-2"
            />
            <VPNavBarTranslations />
            <VPSocialLink :href="GITHUB_URL" />
          </div>
        </v-list-item>
        <v-divider class="my-2" />
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
import { mdiHelpCircle, mdiInformation } from "@mdi/js";
import { useToggle } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import TheSnackbar from "@/components/TheSnackbar.vue";
import VPNavBarTranslations from "@/components/VPNavBarTranslations.vue";
import VPSocialLink from "@/components/VPSocialLink.vue";
import VPSwitchAppearance from "@/components/VPSwitchAppearance.vue";
import { ROUTES_ABOUT, ROUTES_HELP } from "@/constants";
import { useThemeStore } from "@/stores/theme";
import { debug } from "@/utils/debug";

const [drawer, toggleDrawer] = useToggle();
const themeStore = useThemeStore();
const theme = computed(() => (themeStore.isDark ? "dark" : "light"));

const GITHUB_URL = "https://github.com/it-at-m/UnicodeEingabeKiwi2";
const kiwi2Version = ref("");

const { t, locale } = useI18n();

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
    const data = await response.json();
    kiwi2Version.value = data.tag_name || "";
  } catch (error) {
    console.error("Failed to fetch release version:", error);
  }
});
</script>

<style>
.main {
  background-color: white;
}

.v-toolbar-title {
  white-space: nowrap;
}

.v-toolbar-title__placeholder {
  width: 300px !important;
}

.invert-colors {
  filter: invert(1) brightness(100%);
}

.invert-black-white {
  filter: invert(1) hue-rotate(0deg) brightness(100%) saturate(0%);
}

/* Specific transitions for themed elements */
.v-application,
.v-card,
.v-btn:not(.v-btn--icon),
.v-list,
.v-list-item,
.v-navigation-drawer,
.v-app-bar {
  transition:
    background-color 100ms ease-in-out,
    color 100ms ease-in-out !important;
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
