
import { ActionContext } from "vuex";
import { RootState } from "@/store";

export interface FeatureState {
    serif: boolean;
    basechar: boolean;
    history: boolean;
}

//
// Feature toggles
//
export default {
    
    namespaced: true,

    state: {
        //
        // Default values
        //
        serif: false,
        basechar: false,
        history: false,

    } as FeatureState,

    mutations: {
        setSerif(state: FeatureState, serif: boolean): void {
            state.serif = serif;
        },
        setBasechar(state: FeatureState, basechar: boolean): void {
            state.basechar = basechar;
        },
        setHistory(state: FeatureState, history: boolean): void {
            state.history = history;
        },
    },

    getters: {
        featureSerif(state: FeatureState): boolean {
            return state.serif;
        },
        featureBasechar(state: FeatureState): boolean {
            return state.basechar;
        },
        featureHistory(state: FeatureState): boolean {
            return state.history;
        },
    },

    actions: {
        updateSerif(context: ActionContext<FeatureState, RootState>, serif: boolean): void {
            context.commit('setSerif', serif);
        },
        updateBasechar(context: ActionContext<FeatureState, RootState>, basechar: boolean): void {
            context.commit('setBasechar', basechar);
        },
        updateHistory(context: ActionContext<FeatureState, RootState>, history: boolean): void {
            context.commit('setHistory', history);
        },
    },
};
