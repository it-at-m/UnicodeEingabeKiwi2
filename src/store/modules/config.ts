
import { ActionContext } from "vuex";
import { RootState } from "@/store";

export interface ConfigState {
    automaticFocus: boolean;
    compactView: boolean;
    filterCases: string;
    filterProfile: string; 
    newsSeen: boolean;
    displaySerif: boolean;

    storageModelVersion: number;
}

//
// Default values
//
const initialState = {
    automaticFocus: true,
    compactView: false,
    filterCases: "s", // Wie suche
    filterProfile: "id1", // TODO: set via property
    newsSeen: false,
    displaySerif: false,

    storageModelVersion: 1 // Keep in sync with App.vue
} as ConfigState;

//
// Nur für Einstellungen, die dann in den Local-Storage synchronisiert werden.
//
export default {
    
    namespaced: true,

    state: initialState,

    mutations: {
        setAutomaticFocus(state: ConfigState, automaticFocus: boolean): void {
            state.automaticFocus = automaticFocus;
            console.debug("Updated automaticFocus.");
        },

        setCompactView(state: ConfigState, compactView: boolean): void {
            state.compactView = compactView;
            console.debug("Updated compactView.");
        },

        setFilterCases(state: ConfigState, filterCases: string): void {
            state.filterCases = filterCases;
            console.debug("Updated filterCases.");
        },

        setFilterProfile(state: ConfigState, filterProfile: string): void {
            state.filterProfile = filterProfile;
            console.debug("Updated filterProfile.");
        },

        setNewsSeen(state: ConfigState, newsSeen: boolean): void {
            state.newsSeen = newsSeen;
            console.debug("Updated newsSeen.");
        },

        setDisplaySerif(state: ConfigState, displaySerif: boolean): void {
            state.displaySerif = displaySerif;
            console.debug("Updated displaySerif.");
        },

        resetStorageModel(state: ConfigState): void {
            Object.assign(state, initialState);
            console.debug("Reset config storage");
        }
    },

    getters: {
        // empty
    },

    actions: {
        updateAutomaticFocus(context: ActionContext<ConfigState, RootState>, automaticFocus: boolean): void {
            context.commit('setAutomaticFocus', automaticFocus);
        },

        updateCompactView(context: ActionContext<ConfigState, RootState>, compactView: boolean): void {
            context.commit('setCompactView', compactView);
        },

        updateFilterCases(context: ActionContext<ConfigState, RootState>, filterCases: string): void {
            context.commit('setFilterCases', filterCases);
        },

        updateFilterProfile(context: ActionContext<ConfigState, RootState>, filterProfile: string): void {
            context.commit('setFilterProfile', filterProfile);
        },

        updateNewsSeen(context: ActionContext<ConfigState, RootState>, newsSeen: boolean): void {
            context.commit('setNewsSeen', newsSeen);
        },

        updateDisplaySerif(context: ActionContext<ConfigState, RootState>, displaySerif: boolean): void {
            context.commit('setDisplaySerif', displaySerif);
        },
        
        resetStorageModel(context: ActionContext<ConfigState, RootState>): void {
            context.commit('resetStorageModel');
        },
    },
};
