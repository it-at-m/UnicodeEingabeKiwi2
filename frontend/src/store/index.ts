import Vue from 'vue';
import Vuex from 'vuex';
import snackbar, {SnackbarState} from './modules/snackbar';
import config, {ConfigState} from './modules/config';
import feature, {FeatureState} from './modules/feature';

import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence<RootState>({
    storage: window.localStorage,
    key: 'kiwi',
    asyncStorage: false,
    modules: [
        'config',
        'feature',
    ]
});

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';

export interface RootState {
    snackbarState: SnackbarState;
    configState: ConfigState;
    toggleState: FeatureState;
}

export default new Vuex.Store<RootState>({
    modules: {
        config,
        snackbar,
        feature
    },
    plugins: [
        vuexLocal.plugin
    ],
    strict: debug
});
