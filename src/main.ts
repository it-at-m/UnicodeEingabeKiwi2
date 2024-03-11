import Vue, { VNode } from 'vue';
import Vuetify from "./plugins/vuetify";
import store from './store';
import App from './App.vue';
import Router from "vue-router";
import moment from "moment";
import VueI18n from 'vue-i18n';
import { default as messagesDe } from "../locale/de.json";
import { default as messagesEn } from "../locale/de.json";
import { getModel } from './api/StringLatinModelService';
import Main from './views/Main.vue';
import History from './views/History.vue';
import { Levels } from './api/error';
import vuetify from "./plugins/vuetify";


Vue.config.productionTip = false;

// 
// Common (shared) stateless model instance
//
const model = getModel();

//
// Errorhandling 
// see https://vuejs.org/v2/api/#errorHandler
//
Vue.config.errorHandler = (err, vm, info) => {
    console.error("Error: '" + info + "': ", err);
    vm.$store.dispatch("snackbar/showMessage", {
        message: "Ein unbekannter Fehler ist aufgetreten, bitte den Administrator informieren und/oder später noch einmal probieren. <br>" + 
                 "An unknown error has occurred, please inform the administrator and/or try again later.",
        level: Levels.ERROR
    });
};

//
// router
// 
Vue.use(Router);

/*
* Preventing "NavigationDuplicated" errors in console in Vue-router >= 3.1.0
* https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
* */
/* eslint-disable @typescript-eslint/no-explicit-any */
const routerMethods = ['push', 'replace'];
routerMethods.forEach((method: string) => {
    const originalCall = (Router.prototype as any)[method];
    (Router.prototype as any)[method] = function(location: any, onResolve: any, onReject: any): Promise<any> {
        if (onResolve || onReject) {
            return originalCall.call(this, location, onResolve, onReject);
        }
        return (originalCall.call(this, location) as any).catch((err: any) => err);
    };
});
/* eslint-enable @typescript-eslint/no-explicit-any */

const router = new Router({
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            component: Main,
            props: {
                default: true,
                model: model
            }
        },
        {
            path: "/history",
            name: "history",
            component: History,
            props: {
                default: true,
                model: model
            }
        },

        // Fallback
        {
            path: '*',
            redirect: '/'
        }
    ]
});

moment.locale("de");

//
// I18N
//
Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: 'de',
    fallbackLocale: 'de',
    messages: {
        "de": messagesDe,
        "en": messagesEn
    }
});

// 
// Create instance
//
new Vue({
    i18n,
    router,
    store: store,
    vuetify,
    render: (h): VNode => h(
        App,
        {
            props: {
                model: model
            }
        }),
}).$mount('#app');
