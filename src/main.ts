import { createApp } from "vue";
import { debug } from "@/utils/debug";
import App from "@/App.vue";
import i18n from "@/plugins/i18n";
import { registerPlugins } from "@/plugins";
import { loadFonts } from "@/plugins/webfontloader";
import pinia from "@/plugins/pinia";

import "unfonts.css";

loadFonts();

const app = createApp(App);

// Install i18n first
app.use(i18n);

// Log i18n global instance
debug.log('i18n global instance check', {
  hasGlobal: !!i18n.global,
  currentLocale: i18n.global.locale.value,
  fallbackLocale: i18n.global.fallbackLocale.value,
  availableLocales: i18n.global.availableLocales,
  hasMessages: !!i18n.global.messages.value,
});

app.use(pinia);
registerPlugins(app);

app.mount("#app");
