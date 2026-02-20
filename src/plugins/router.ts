// Composables
import { createRouter, createWebHistory } from "vue-router";

import { getModel } from "@/api/StringLatinModelService";
import { ROUTES_ABOUT, ROUTES_HELP, ROUTES_HOME } from "@/constants";
import Main from "@/views/Main.vue";

const model = getModel();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: ROUTES_HOME,
      component: Main,
      props: {
        model: model,
      },
    },
    {
      path: "/help",
      name: ROUTES_HELP,
      component: () => import("@/views/HelpView.vue"),
    },
    {
      path: "/about",
      name: ROUTES_ABOUT,
      component: () => import("@/views/AboutView.vue"),
    },
  ],
});

export default router;
