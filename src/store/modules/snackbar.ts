import {Levels} from "@/api/error";
import {ActionContext} from "vuex";
import {RootState} from "@/store";

export interface SnackbarState {
    message: string | undefined;
    level: Levels;
    version: number; 
}

export default {
    namespaced: true,
    state: {
        message: undefined,
        level: Levels.INFO,
        version: 0
    } as SnackbarState,

    getters: {
    },

    mutations: {
        SET_MESSAGE(state: SnackbarState, message: string): void {
            state.message = message;
        },
        SET_LEVEL(state: SnackbarState, level: Levels): void {
            state.level = level;
        },
        UPDATE_VERSION(state: SnackbarState): void {
            state.version++;
        }
    },
    
    actions: {
        showMessage(context: ActionContext<SnackbarState, RootState>, info: { message: string; level: Levels | undefined }): void {
            context.commit('SET_LEVEL', (info.level) ? info.level : Levels.INFO);
            context.commit('SET_MESSAGE', info.message);
            context.commit('UPDATE_VERSION');
            console.log("showMessage()");
        }
    }
};
