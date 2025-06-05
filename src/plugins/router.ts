// Composables
import { createRouter, createWebHistory } from "vue-router";

import { ROUTES_HOME, ROUTES_HELP, ROUTES_ABOUT } from "@/constants";
import Main from "@/views/Main.vue";
import { getModel } from "@/api/StringLatinModelService";

const model = getModel();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  {
    path: "/",
    name: ROUTES_HOME,
      component: Main,
      props: {
        model: model
      }
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
