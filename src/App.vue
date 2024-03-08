<template>
  <v-app>
    <TheSnackbar />

    <v-dialog
      id="newsdialog"
      v-model="newsDialog"
      width="90%"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 hyphen">
          {{ $t("newsdialog.title") }}
        </v-card-title>
        <v-card-text class="hyphen">
          <ul class="text">
            <li 
              v-for="t in $t('newsdialog.listitems')" 
              :key="t"
            >
              {{ t }}
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-checkbox
            id="newsdialogdontaskagain"
            v-model="newsDialogDontAskAgain"
            :label="$t('newsdialog.dontaskagain')"
          />
          <v-spacer />
          <v-btn
            id="newsdialognobutton"
            ref="newsDialogNoButton"
            text
            @click="newsDenied"
          >
            {{ $t("newsdialog.nobutton") }}
          </v-btn>
          <v-btn
            id="newsdialogyesbutton"
            ref="newsDialogYesButton"
            text
            @click="newsRequested"
          >
            {{ $t("newsdialog.yesbutton") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 
      Do not use property hide-on-scoll here, because there is an open bug in vuetify for apple safari
      https://github.com/vuetifyjs/vuetify/issues/12573 
      Instead fix it using app property, which makes v-app-bar sticky and override it using css.
      -->
    <v-app-bar
      absolute
      flat
      clipped-right
      color="white"
      style="flex: none;"
    >
      <v-btn
        id="home"
        icon
        :title="$t('appbar.kiwilogo_alt')"
        @click="__gotoHome"
      >
        <v-img
          :src="require('../public/images/Kiwi-Bird-Logo.svg')"
          :alt="$t('appbar.kiwilogo_alt')"
          contain
          height="35"
        />
      </v-btn>

      <v-toolbar-title class="font-weight-bold">
        <span class="black--text">Kiwi</span>
      </v-toolbar-title>

      <v-spacer />

      <v-btn
        v-if="featureHistory === true" 
        id="openhistory"
        :title="$t('appbar.openhistory_alt')"
        icon
      >
        <v-icon
          tabindex="-1"
          :alt="$t('appbar.openhistory_alt')"
          :aria-label="$t('appbar.openhistory_alt')"
          @click="__toggleHistory"
        >
          mdi-history
        </v-icon>
      </v-btn>

      <v-btn
        id="openhelp"
        :title="$t('appbar.openhelp_alt')"
        icon
      >
        <v-icon
          tabindex="-1"
          :alt="$t('appbar.openhelp_alt')"
          :aria-label="$t('appbar.openhelp_alt')"
          @click="helpRequested"
        >
          mdi-help-circle
        </v-icon>
      </v-btn>

      <v-app-bar-nav-icon 
        id="opensettings"
        :title="$t('appbar.options_alt')"
        @click.stop="drawer = !drawer"
      >
        <slot>
          <v-img
            :src="require('./assets/settings-icon.svg')"
            :alt="$t('appbar.options_alt')"
            contain
            height="20"
          />
        </slot>
      </v-app-bar-nav-icon>

      <slot name="extension">
        <div class="lhmline">
          <div class="upper">
            &nbsp;
          </div>
          <div class="lower">
            &nbsp;
          </div>
        </div>
      </slot> 
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      right
      disable-resize-watcher
      temporary
    >
      <v-list>
        <v-list-item
          :title="$t('sidebar.appname_alt')"
        >
          <a 
            id="appnameversion"
            class="link"
            @click="__aboutRequested"
          >
            Kiwi {{ $t("sidebar.appversion") }} (Build {{ $t("sidebar.buildno") }})
          </a>  
        </v-list-item>
        <v-list-item
          :title="$t('sidebar.dataname_alt')"
        >
          <div
            id="dataname"
          >
            {{ $t("sidebar.dataname") }}: {{ dataname }}
          </div>  
        </v-list-item>
        <v-list-item
          :title="$t('sidebar.dataversion_alt')"
        >
          <div
            id="dataversion"
          >
            {{ $t("sidebar.dataversion") }}: {{ dataversion }}
          </div>
        </v-list-item>

        <v-divider />
        <v-list-item
          :title="$t('sidebar.compactview_alt')"
        >
          <v-checkbox
            id="compactviewoption"
            v-model="compactView"
            :label="$t('sidebar.compactview')"
            @change="compactViewChanged"
          />
        </v-list-item>
        <v-list-item
          :title="$t('sidebar.automaticfocus_alt')"
        >
          <v-checkbox
            id="automaticfocusoption"
            v-model="automaticFocus"
            :label="$t('sidebar.automaticfocus')"
            @change="automaticFocusChanged"
          />
        </v-list-item>
        <v-list-item
          v-if="featureSerif === true"
          :title="$t('sidebar.displayserif_alt')"
        >
          <v-checkbox
            id="serifoption"
            v-model="displaySerif"
            :label="$t('sidebar.displayserif')"
            @change="displaySerifChanged"
          />
        </v-list-item>

        <v-divider />
        <v-list-item>
          <v-btn
            id="resetnotifications"
            width="100%"
            class="nocap hyphen"
            :title="$t('sidebar.resetnotifications_alt')"
            @click="__resetnotifications"
          >
            {{ $t("sidebar.resetnotifications") }}
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <v-fade-transition mode="out-in">
          <router-view />
        </v-fade-transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import { Prop } from 'vue-property-decorator';
    import TheSnackbar from '@/components/TheSnackbar.vue';
    import { StringLatinModelService } from "./api/StringLatinModelService";
    import FocusUtils from './api/FocusUtils';

    @Component({
        components: { TheSnackbar }
    })
    export default class App extends Vue {

        drawer = false;

        newsDialog = false;
        newsDialogDontAskAgain = false;

        automaticFocus: boolean = this.$store.state.config.automaticFocus;
        compactView: boolean = this.$store.state.config.compactView;

        newsSeen: boolean = this.$store.state.config.newsSeen;

        dataversion = "";
        dataname = "";

        helpMapping: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any 

        private language = "de";

        displaySerif = this.$store.state.config.displaySerif;

        @Prop({type: StringLatinModelService, required: true})
        private readonly model!: StringLatinModelService;

        mounted(): void {
          console.debug("App.vue: mounted()");

          window.addEventListener('keyup', (event: KeyboardEvent) => {
            // F1-Key
            if (event.keyCode === 112) {
              event.preventDefault();
              this.helpRequested();
              return;
            }

            // F8-Key
            if ((event.keyCode === 119) && (this.featureHistory === true)) {
              event.preventDefault();
              this.__toggleHistory();
              return;
            }
		
          });

          this.model.getModelProperties().then((result) => {
            this.dataversion = result.dataversion;
            this.dataname = result.name;
          });

          this.__prepareHelpMapping();

          this.__updateOrResetStorageModel();

          if (this.newsSeen === false) {
            this.newsDialog = true;
            this.$nextTick(() => {
              setTimeout(() => {
                const btn = FocusUtils.getHTMElem(this,"newsDialogYesButton");
                if (btn) {
                  FocusUtils.focus(btn);
                }
              },FocusUtils.RENDER_DELAY);
            });
          }
        }

        //
        // Computed
        //
        get featureHistory(): boolean {
          return this.$store.state.feature.history;
        }

        get featureSerif(): boolean {
          return this.$store.state.feature.serif;
        }

        get existingStoreModelVersion(): number {
          return this.$store.state.config.storageModelVersion; 
        }

        //
        // Functions
        //
        displaySerifChanged(): void {
          this.$store.dispatch('config/updateDisplaySerif', this.displaySerif);
        }

        compactViewChanged(): void {
          this.$store.dispatch('config/updateCompactView', this.compactView);
        }

        automaticFocusChanged(): void {
          this.$store.dispatch('config/updateAutomaticFocus', this.automaticFocus);
        }

        //
        // Online help requested
        //
        helpRequested(): void { 
        console.debug("helpRequested().");
        const activeElem = this.findActiveElement();
        let helpUrl = this.__mapActiveElement(activeElem);
        // Using replace with a global flag
        helpUrl = helpUrl.replace(/%%lang%%/g, this.language);

        this._openWindow(helpUrl, "help");
      }

      newsRequested(): void {
        console.debug("newsRequested().");
        this.$store.dispatch('config/updateNewsSeen', this.newsDialogDontAskAgain);
        this.newsDialog = false;

        let helpUrl = this.helpMapping["special/prefix"] + this.helpMapping["App/news"];
        // Using replace with a global flag
        helpUrl = helpUrl.replace(/%%lang%%/g, this.language);

        this._openWindow(helpUrl, "help");
      }

        newsDenied(): void {
          console.debug("newsDenied().");
          this.$store.dispatch('config/updateNewsSeen', this.newsDialogDontAskAgain);
          this.newsDialog = false;
        }

        private __updateOrResetStorageModel(): void {
          const currentStorageModelVersion = 1; // Sync with config.ts 
          const existingStorageModelVersion = this.existingStoreModelVersion;

          if ((existingStorageModelVersion) && (existingStorageModelVersion === currentStorageModelVersion)) {
            console.debug("__updateOrResetStorageModel(): Detected from local storage, that browser has been here before and model version matches -- nothing to do.");

          } else {
            console.debug("__updateOrResetStorageModel(): Detected from local storage, that browsers hasn't been here before or constraints an older model version -- reseting it.");
            this.$store.dispatch('config/resetStorageModel');

          }
        }

        private __toggleHistory(): void {
          console.debug("Current route: '" + this.$route.name + "'.");
          if (this.$route.name === 'home') {
            this.$router.push({ name: 'history' });

          } else {
            this.$router.push({ name: 'home' });
            
          }
        }

        private __gotoHome(): void {
          this.$router.push({ name: 'home' });
        }

        private __aboutRequested(): void {
          // Opening using javascript necessary, because for security reasons 
          // refuses to close windows, that have not been opened using javascript.
          const aboutUrl = "help/%%lang%%/about.html".replace(new RegExp("%%lang%%","g"),this.language);
          this._openWindow(aboutUrl,"about");
        }

        private __resetnotifications(): void {
          this.$store.dispatch('config/updateNewsSeen', false);
        }

        private _openWindow(url: string, target = ""): void {
          const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
          const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

          console.debug("_openWindow: \"" + url + "\".");
          const newWindow = window.open(url, target, "menubar=no, toolbar=no, location=no, directories=no, status=no, scrollbars=yes, resizable=yes, dependent, innerWidth=" + w + ", innerHeight=" + h);
          if (newWindow) {
            FocusUtils.focus(newWindow);
          }
        }

        findActiveElement(): { component: string; id: string } {
          const activeElemId = (document.activeElement) ? document.activeElement.id : "0";
          const component = "App";
          console.debug("Active element: component=\"" + component + "\", id=\"" + activeElemId + "\".");
          return { 
            component: component,
            id : activeElemId
          };
        }

        // 
        // Map active element to section identifier
        //
        private __mapActiveElement(elem: { component: string; id: string }): string {
          if (elem === null) {
            return this.helpMapping["special/fallback"];

          }

          const key = elem.component + "/" + elem.id;
          console.debug("Help requested for context key=\"" + key + "\".");

          let result = null;
          const keyBoardRe = new RegExp("App/id[0-9a-f]+");
          if (keyBoardRe.exec(key)) {
            // Id, that matches certain syntax are keyboard keys.
            result = this.helpMapping["App/keyboard"];
          } else {
            // Check mapping
            result = this.helpMapping[key];
          }

          if (result == null) { // Compare for null in all variants
            // Map to root page
            console.debug("No help mapping found for key \"" + key + "\" -- mapping to root page.");
            result = this.helpMapping["special/fallback"];
          }

          // Add prefix to complete url
          result = this.helpMapping["special/prefix"] + result;

          // Add locale (ie. this.language) to URL: e.g. lang=de
          result = result.replace(new RegExp("%%lang%%","g"),this.language);

          console.debug("Mapping help from " + key + " to \"" + result + "\".");
          return result;
        }


        //
        // Prepare help mapping
        //
        private __prepareHelpMapping() {
          console.debug("Prepare help mapping.");

          //
          // Load JSON file containing the mappings for online help
          //
          fetch("help-mapping.json", {
            credentials: "same-origin", 
          }).then((response) => {
            if (! response.ok) {
              throw new Error('Cannot load help mapping ' + response.statusText);
            }

            return response.text();

          }).then((text: string) => {
            //
            // JavaScript style comments line comments processing
            //
            const commentRe = new RegExp("^\\s*//");
            const stripped = text.split("\n").filter((line) => {
              return commentRe.exec(line) === null;
            }).join("\n");
            return JSON.parse(stripped);

          }).then((json) => {
            this.helpMapping = json;
 
          });
        }

    }
</script>

<style>
  @import '../public/shared-styles.css';

  .main {
    background-color: white;
  }

  .v-toolbar {
    height: 65px !important;
    position: static !important;
    display: block !important; 
    flex: 0 0 auto;
  }

  .v-btn__content {
    color: black;
  }

  .v-label {
    color: black !important;
  }

  .text {
    color: black;
  }

  .lhmline {
    position: absolute;
    top: 56px;
    left: 0px;
    width: 100%;
    height: 6px;
    margin-top: 3px;
    margin-bottom: 3px;
  }

  .v-main__wrap {
    background-color: #eeeeee;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
