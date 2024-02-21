<template>
  <div>
    <v-container
      fluid
    >
      <!-- 
        bufferpanel
        -->
      <v-row
        v-if="compactView === false"
      >
        <h1 
          class="v-label"
        >
          {{ $t("main.bufferpanel_header") }}
        </h1>
      </v-row>
      <v-row
        id="bufferpanel"
        class="sticky"
        align="center"
      >
        <v-col mb-4>
          <v-text-field
            id="mainbuffer"
            ref="mainbuffer"
            v-model="mainbuffer"
            class="nocap"
            :class="{ serifStyle: displaySerif, sansStyle: displaySans }"
            :label="$t('main.mainbuffer_label')"
            color="black"
            filled
            hide-details
            dense
            autofocus
            type="text"
            background-color="white"
            @keyup.enter.exact="searchBaseChar"
          >
            <template #append>
              <v-btn
                id="clearbufferbutton"
                icon
                :title="$t('main.mainbuffer_alt')"
                @click="clearbuffer"
              >
                <v-icon
                  :alt="$t('main.mainbuffer_alt')"
                >
                  mdi-close
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>

        <v-btn
          id="searchcharbutton"
          icon
          :title="$t('main.search_char_alt')"
          @click="searchBaseChar"
        >
          <v-icon
            :alt="$t('main.search_char_alt')"
          >
            mdi-magnify
          </v-icon>
        </v-btn>
        <v-btn
          id="copytobutton"
          icon
          :title="$t('main.clipboard_copy_alt')"
          @click="copyToClipboard"
        >
          <v-icon
            :alt="$t('main.clipboard_copy_alt')"
          >
            mdi-content-copy
          </v-icon>
        </v-btn>
      </v-row>

      <!--
        filter panel
        -->
      <v-row
        v-if="compactView === false"
      >
        <h1
          class="v-label"
        >
          {{ $t("main.filterpanel_header") }}
        </h1>
      </v-row>
      <v-row
        id="filterpanel"
        align="baseline"
      >
        <v-col>
          <v-select
            id="filtercases"
            v-model="filterCases"
            class="nocap"
            :label="$t('main.filtercases')"
            :title="$t('main.filtercases_alt')"
            :items="caseing"
            item-text="name"
            item-value="id"
            return-object
            hide-details
            @change="filterCaseingChanged"
          >
            <template #item="{ item, attrs, on }">
              <v-list-item 
                v-bind="attrs"
                v-on="on" 
              >
                <v-list-item-content>
                  <v-list-item-title
                    :title="item.descr"
                  >
                    {{ item.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col>
          <v-select
            id="filterregion"
            v-model="filterProfile"
            class="nocap"
            :label="$t('main.filterregion')"
            :title="$t('main.filterregion_alt')"
            :items="profiles"
            item-text="name"
            item-value="id"
            return-object
            hide-details
            @change="filterProfileChanged"
          >
            <template #item="{ item, attrs, on }">
              <v-list-item 
                v-bind="attrs"
                v-on="on" 
              >
                <v-list-item-content>
                  <v-list-item-title
                    :title="item.descr"
                  >
                    {{ item.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col
          v-if="featureBasechar === true"
        >
          <v-text-field
            id="filterbasechar"
            ref="filterbasechar"
            v-model="filterBasechar"
            readonly
            class="nocap"
            flat
            hide-details
            :label="$t('main.filterbasechar')"
            :title="$t('main.filterbasechar_alt')"
            dense
            color="black"
            background-color="#eeeeee"
          >
            <template #append>
              <v-btn
                id="clearbasecharbutton"
                icon
                :title="$t('main.clearfilterbasecharbutton_alt')"
                @click="clearBasecharFilter"
              >
                <v-icon
                  :alt="$t('main.clearfilterbasecharbutton_alt')"
                >
                  mdi-close
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
        <v-col>
          <v-btn
            id="resetallfilters"
            class="nocap hyphen"
            :title="$t('main.filterresetall_alt')"
            @click="resetAllFilters"
          >
            {{ $t("main.filterresetall") }}
          </v-btn>
        </v-col>
      </v-row>

      <!--
        Keyboard panel
        -->
      <v-row
        v-if="compactView === false"
      >
        <h1
          class="v-label"
        >
          {{ $t("main.keyboardpanel_header") }}
        </h1>
      </v-row>
      <v-row
        v-if="keyboard.length > 0"
        id="keyboardpanel"
        ref="keyboardpanel"
      >
        <!-- Caution: Standard buttons, because vuetify and vue slow down eventhandling due to complex 
                      dom structure too much, when the dom (here: the many keys) too much. -->
        <div
          v-for="c in keyboard"
          :key="c.id"
        > 
          <div v-if="c.info">
            <button
              :id="c.id"
              type="button"
              class="nocap key"
              :class="{ serifStyle: displaySerif, sansStyle: displaySans }"
              :title="c.info" 
              tabindex="0"
              @click="charTapped"
            >
              {{ c.name }}
            </button>
          </div>
          <div v-else>
            <button
              :id="c.id"
              type="button"
              class="nocap key"
              :class="{ serifStyle: displaySerif, sansStyle: displaySans }"
              tabindex="0"
              @click="charTapped"
            >
              {{ c.name }}
            </button>
          </div>
        </div>
      </v-row>
      <v-row v-else>
        <p>{{ $t("main.keyboardpanel_nochars") }}</p>
      </v-row>
    </v-container>

    <yes-no-dialog
      v-model="saveLeaveDialog"
      :dialogtitle="$t('main.leavedialog_title')"
      :dialogtext="$t('main.leavedialog_text')"
      @no="cancel"
      @yes="leave"
    />
  </div>
</template>

<script lang="ts">
    import { Component, Mixins, Prop /*, Watch */ } from 'vue-property-decorator';
    import SaveLeaveMixin from "@/mixins/saveLeaveMixin";
    import YesNoDialog from "@/components/common/YesNoDialog.vue";
    import { StringLatinModelService } from "../api/StringLatinModelService";
    import * as clipboard from "clipboard-polyfill/text";
    import Graphemer from "graphemer";
    import { Levels, KiwiError, ThreadErrorHandler } from "@/api/error";
    import FocusUtils from "@/api/FocusUtils";

    @Component({
      components: { YesNoDialog }
    })
    export default class App extends Mixins(SaveLeaveMixin) {

        @Prop({type: StringLatinModelService, required: true})
        private readonly model!: StringLatinModelService;

        private numSearches = 0;

        private mainbuffer = "";

        private mainBufferInputElem!: HTMLInputElement;

        private replaceLastGraphme = false;

        private keyboard: { id: string; name: string; info: string }[] = [];

        private profiles: { seq: number; id: string; name: string; descr: string }[] = [];

        readonly caseing: { seq: number; id: string; name: string; descr: string; }[] = [
          { seq: 0, id: "s", name: this.$t('main.caseing_s').toString(), descr: this.$t('main.caseing_s_alt').toString() },
          { seq: 1, id: "g", name: this.$t('main.caseing_g').toString(), descr: this.$t('main.caseing_g_alt').toString() },
          { seq: 2, id: "k", name: this.$t('main.caseing_k').toString(), descr: this.$t('main.caseing_k_alt').toString() },
          { seq: 3, id: "gk", name: this.$t('main.caseing_gk').toString(), descr: this.$t('main.caseing_gk_alt').toString() },
        ];

        private readonly splitter = new Graphemer();

        //
        // Currently applied filters
        //
        private searchChar = "";

        private filterCases: string = this.$store.state.config.filterCases;
        private filterProfile: string = this.$store.state.config.filterProfile;
        private filterBasechar = "";


        mounted(): void {
          console.debug("Main.vue: mounted()");

          window.addEventListener('keyup', (event: KeyboardEvent) => {
            // Cntrl or Meta (Apple!) + c key sequence
            if ((event.metaKey || event.ctrlKey) && event.keyCode === 67) {
              event.preventDefault();
              this.copyToClipboard();
              return;
            }
            // Cntrl or Meta (Apple!) + space key sequence
            if ((event.metaKey || event.ctrlKey) && event.keyCode === 32) {
              event.preventDefault();
              this.searchBaseChar();
              return;
            }
          });

          (this.model as StringLatinModelService).getAllProfiles().then((result) => {
            this.profiles = result;
          }).then(() => {
            this.runSearch();
          }).then(() => {
            const inputElem = this.getMainBufferInputElem();
            if (inputElem) {
              this.mainBufferInputElem = inputElem;
            } else {
              const msg = "Cannot determine inputelement of v-text-field with id=mainbuffer.";
              console.error(msg);
              throw new KiwiError({ message: msg });
            }
          }).catch(error => {
            ThreadErrorHandler.handleError(this,error);
          });

        }

        //
        // Computed
        //
        get compactView(): boolean {
          return this.$store.state.config.compactView;
        }

        get automaticFocus(): boolean {
          return this.$store.state.config.automaticFocus;
        }

        get filterRegion(): string {
          return this.$store.state.config.filterRegion;
        }

        get displaySerif(): boolean {
          return this.$store.state.config.displaySerif;
        }

        get displaySans(): boolean {
          return (! this.displaySerif);
        }

        get featureSerif(): boolean {
          return this.$store.state.feature.serif;
        }

        get featureBasechar(): boolean {
          return this.$store.state.feature.basechar;
        }

        //
        // Functions
        //
        charTapped(e: PointerEvent): void {
          const c = (e.target as HTMLInputElement).innerText;
          console.debug("Char " + c + " tapped.");

          let selection = this.getBufferSelection();
          let model = this.mainbuffer;

          if (this.replaceLastGraphme === true) {
            //
            // Replace last grapheme even if it was not selected
            //
            const graphemes = this.splitter.splitGraphemes(this.mainbuffer);
            const grapheme = graphemes.slice(-1)[0];
            const newUctext = model.slice(0, model.length - grapheme.length) + c;
            this.updateMainBufferAdjustCaret(newUctext,c.length - grapheme.length);

          } else if (selection.start === selection.end) {
            //
            // Cursor-Pos. keine Selektion
            //
            const newUctext = (selection.end === model.length) 
              ? model + c
              : model.slice(0, selection.start) + c + model.slice(selection.end);
            this.updateMainBufferAdjustCaret(newUctext,c.length);

          } else {
            //
            // Selektion
            //
            this.updateMainBufferAdjustCaret(model.slice(0, selection.start) + c + model.slice(selection.end),c.length);

          }

          this.replaceLastGraphme = false;

          //
          // Autom. focus management
          //
          if (this.automaticFocus) {
            console.debug("Focusing mainbuffer.");
            FocusUtils.focus(this.mainBufferInputElem,FocusUtils.RENDER_DELAY);
          }
        }

        searchBaseChar(): void {
          if (this.mainbuffer.trim() === "") {
            return;
          }

          this.searchChar = this.getIntendedSearchChar();

          (this.model as StringLatinModelService).getBasecharByChar(this.searchChar).then((selectedChar) => {
            console.debug("searchBaseChar(): selectedChar = \"" + selectedChar + "\".");
            if (selectedChar === "") {
              console.debug("searchBaseChar(): No selection -- ignoring request.");

            } else {
              console.debug("searchBaseChar(): last char is filled searching for it");
              this.filterBasechar = selectedChar;
              this.runSearch();

            }
          });
        }

        isDirty(): boolean {
          const dirty = (this.mainbuffer) ? true : false; 
          console.debug("isDirty(()=" + dirty);
          return dirty;
        }

        clearbuffer(): void {
          this.mainbuffer = "";
        }

        private getFirstKeyboardKey(): HTMLElement | null {
          return FocusUtils.getHTMElem(this,"keyboardpanel","div button");
        }

        private getIntendedSearchChar(): string {
          if (this.mainbuffer.trim() === "") {
            return "";
          }

          let grapheme = undefined;
          const selection = this.getBufferSelection();
          if (selection.start === selection.end) {
            console.debug("getIntendedSearchChar(): no selection -- using last grapheme of whole text removing it.");

            const graphemes = this.splitter.splitGraphemes(this.mainbuffer);
            grapheme = graphemes.slice(-1)[0];
            console.debug("getIntendedSearchChar(): length of last grapheme " + grapheme.length + ".");
            this.replaceLastGraphme = true;

          } else {
            console.debug("getIntendedSearchChar(): detected selection -- using first grapheme it.");

            //
            // Here we rely on correct unicode processing of the browser: 
            // Selection needs to contain the basechar plus all combining chars... 
            //
            let selectionText = this.mainbuffer.slice(selection.start, selection.end);
            console.debug("getIntendedSearchChar(): selected text: \"" + selectionText + "\".");

            const graphemes = this.splitter.splitGraphemes(selectionText);
            console.debug("_getSearchChar(): length of last grapheme " + selectionText.length + ".");
            grapheme = graphemes[0];
            this.replaceLastGraphme = false;

          } 

          return grapheme;
        }

        filterProfileChanged(e: { seq: number; id: string; name: string; descr: string }): void {
          this.filterProfile = e.id;
          console.debug("Switched to profile '" + this.filterProfile + "'.");
          this.$store.dispatch('config/updateFilterProfile', this.filterProfile);
          this.runSearch();
        }

        filterCaseingChanged(e: { seq: number; id: string; name: string; descr: string }): void {
          this.filterCases = e.id;
          console.debug("Switched to casing '" + this.filterCases + "'.");
          this.$store.dispatch('config/updateFilterCases', this.filterCases);
          this.runSearch();
        }

        clearBasecharFilter(): void {
          console.debug("Switched basechar '" + this.filterBasechar + "'.");
          this.filterBasechar = "";
          this.runSearch();
        }

        copyToClipboard(): void {
          this.mainBufferInputElem.select();
          const normalized = this.mainbuffer.normalize("NFC");
          clipboard.writeText(normalized).then(() => {
            this.$store.dispatch('snackbar/showMessage', { message: this.$t('main.clipboard_message_success').toString() });
            console.log("Copied '" + normalized + "' to clipboard.");
          },() => {
            console.log("Failed to copy to clipboard."); 
            this.$store.dispatch('snackbar/showMessage', { message: this.$t('main.clipboard_message_failure').toString(), level: Levels.ERROR });
          });
          this.mainBufferInputElem.blur();
        }

        resetAllFilters(): void {
          this.filterProfile = "id1";
          this.filterBasechar = "";
          this.filterCases = "s";

          this.searchChar = "";

          //
          // Persistent config
          //
          this.$store.dispatch('config/updateFilterProfile', this.filterProfile);
          this.$store.dispatch('config/updateFilterCases', this.filterCases);
          
          // Update keyboard
          this.runSearch();
        }

        private runSearch(): void {
          console.debug("runSearch()");

          this.mapCharCases().then((cases) => {
            return  (this.model as StringLatinModelService).getFilteredChars(this.filterProfile,this.filterBasechar,"",cases);

          }).then((result) => {
            this.keyboard = result;

            // Focus (only) at application startup the mainbuffer not the keyboard
            if (this.numSearches++ > 0) {

              this.$nextTick(() => {
                if (this.automaticFocus === true) {
                  const firstKeyElem = this.getFirstKeyboardKey();
                  if (firstKeyElem) {
                    console.debug("Focusing first key.");
      -             FocusUtils.focus(firstKeyElem,FocusUtils.RENDER_DELAY_SHORT);
                  }
                }
              });

            }
          });

        }

      private getBufferSelection(): { start: number; end: number } {
        let startIdx = this.mainBufferInputElem.selectionStart;
        let endIdx = this.mainBufferInputElem.selectionEnd;
      
        // Check if you've selected text
        if (startIdx === endIdx) {
          console.debug("The position of the cursor is (" + startIdx + "/" + this.mainBufferInputElem.value.length + ")");
        } else {
          console.debug("Detected selection [ " + startIdx + " , " + endIdx +" [ of " + this.mainBufferInputElem.value.length + " chars.");
        }

        return {
          start: (startIdx === null) ? 0 : startIdx,
          end: (endIdx === null) ? 0 : endIdx,
        };
      }

      private getMainBufferInputElem(): HTMLInputElement | null {
        return FocusUtils.getHTMElem(this,"mainbuffer","input") as HTMLInputElement;
      }

     private updateMainBufferAdjustCaret(newValue: string, adjust: number): void {
        //
        // Get cursor position, set value and store cursor position 
        // after vue updated screen 
        //
        const start = this.mainBufferInputElem.selectionStart;
        this.mainbuffer = newValue;
        this.$nextTick(() => {
          // nextTick doesn't seem to wait long enough => wait additional 10 ms
          setTimeout(() => {
            this.mainBufferInputElem!.selectionStart = start! + adjust;
            this.mainBufferInputElem!.selectionEnd = start! + adjust;
          },10); 
        });

      }

      private async mapCharCases(): Promise<string> {
        switch (this.filterCases) {
        case "s": { // Derived from char searched
          if (this.searchChar) {
            return await (this.model as StringLatinModelService).getCaseOfChar(this.searchChar);

          } else {
            return Promise.resolve("undef");

          }
        }

        case "g": // capital
          return Promise.resolve("capital");

        case "k": // small
          return Promise.resolve("small");

        default: // or both
          return Promise.resolve("undef");
        }
      }
    }
</script>

<style>
  @import '../../public/shared-styles.css';

  /*
   * Common
   */ 
  .serifStyle {
    font-family: serif !important;
  }

  .sansStyle {
    font-family: sans-serif !important;
  }

  .v-label {
    color: black !important;
  }

  h1 {
    padding: 0.5em;
  }

  .v-main {
    padding-top: 0px !important;
  }

  .v-main__wrap > .container {
    padding-top: 0px;
  }

  /*
   * buffer panel
   */
  #bufferpanel {
    border-bottom: thin solid black;
  }

  .sticky {
    position: sticky;
    top: 0px;
    z-index: 3;
    background: #eeeeee;
  }

  #bufferpanel .v-input__append-inner {
    margin-top: 8px;
  }

  /*
   * filter panel
   */
  #filterpanel {
    border-bottom: thin solid black;
  }

  .v-icon {
    color: black !important;
  }

  /* TODO: 
     * Wie kann man dieses Klasse in v-text-field injecten?
     * https://vuejs.org/v2/guide/class-and-style.html 
    input#mainbuffer {
      font-family: serif !important;
    } 
  */

  /*
   * keyboard panel
   */
  #keyboardpanel {
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }

  button.key {
    width: 2.5em;

    /* Copy of styling from vuetify */
    -webkit-text-size-adjust: 100%;
    word-break: normal;
    tab-size: 4;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-box-direction: normal;
    margin: 0;
    font: inherit;
    overflow: visible;
    color: black;
    -webkit-appearance: button;
    border-style: none;
    background-color: #f5f5f5;
    box-shadow: rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px, rgba(0, 0, 0, 0.2) 0px 3px 1px -2px;
    border-radius: 5px;
    padding: 0.5em;
    box-sizing: border-box;
    outline-width: 0;
    cursor: pointer;
    transition: 0.3s;
  }

  button.key:focus {
    /* Copy of styling from vuetify */
    background: rgba(0, 0, 0, 0.3);
  }

  button.key:hover {
    /* Copy of styling from vuetify */
    background-color: #d9d9d9;
  }
</style>
