import { createApp } from "vue";

import App from "@/App.vue";
import { registerPlugins } from "@/plugins";
import { loadFonts } from "@/plugins/webfontloader";
import pinia from "@/plugins/pinia";

import "unfonts.css";

loadFonts();

const app = createApp(App);

app.use(pinia);
registerPlugins(app);

app.mount("#app");
