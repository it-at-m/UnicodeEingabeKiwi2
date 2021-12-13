<template>
  <div>
    <div class="overline">
      {{ label }}
    </div>
    <v-input
      v-model="value"
      :readonly="readonly"
      :hide-details="hideDetails"
      :rules="validierungsRegeln"
      :dense="dense"
      :error.sync="error"
      :error-messages="errorMessages"
      :persistent-hint="persistentHint"
      :hint="hint"
    >
      <v-row>
        <v-col cols="6">
          <v-text-field
            ref="day"
            v-model="day"
            required
            label="Datum"
            :readonly="readonly"
            :error="error"
            hide-details
            :dense="dense"
            :filled="filled"
            :outlined="outlined"
            type="date"
            @focusout="leaveInput"
            @focus="enterInput"
            @blur="sendInput"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            ref="time"
            v-model="time"
            required
            label="Zeit"
            :readonly="readonly"
            :error="error"
            hide-details
            :dense="dense"
            :filled="filled"
            :outlined="outlined"
            type="time"
            @focusout="leaveInput"
            @focus="enterInput"
            @blur="sendInput"
          >
            <template
              v-if="clearable && !readonly"
              #append-outer
            >
              <v-btn
                icon
                :disabled="!value"
                @click="clear"
              >
                <v-icon v-if="value">
                  mdi-close
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-input>
  </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";

    /**
     * Das Date-Time-Input` Feld bietet eine Eingabemöglichkeit von Date-Times ohne zusätzliche
     * Dialoge und möglichst mit den nativen Features des Browsers, welche auch per Tastatur bedient werden können.
     *
     * Beispiel:
     * <datetime-input
     *   id="kontakt-field"
     *   v-model="kontaktDate"
     *   dense
     *   clearable
     *   label="Kontakt am"
     *   :rules="[(v: string) => !v || moment(v).isBefore(moment.now()) || 'Datum muss in der Vergangenheit liegen.']"
     * ></datetime-input>
     *
     * @Prop value: Date-Time im ISO Format (Zugriff in der Regel per v-model)
     * @Prop readonly: Feld ist nicht beschreibbar
     * @Prop hideDetails: Hinweistexte und Errors werden nicht angezeigt
     * @Prop dense: Feld ist kompakter
     * @Prop filled: Feld wird ausgefüllt
     * @Prop outlined: Feld erhält den Outline Style
     * @Prop clearable: Feld ist löschbar
     * @Prop persistentHint: Dauerhafte Anzeige eines Hint-Textes (in Kombination mit @Prop hint)
     * @Prop hint: Hinweistext
     * @Prop label: Label für den Input
     * @Prop rules: Validierungsregeln
     */
    @Component
    export default class DatetimeInput extends Vue {

        @Prop()
        value!: string;
        @Prop({type: Boolean, default: false})
        readonly!: boolean;
        @Prop({type: Boolean, default: false})
        hideDetails!: boolean;
        @Prop({type: Boolean, default: false})
        dense!: boolean;
        @Prop({type: Boolean, default: false})
        filled!: boolean;
        @Prop({type: Boolean, default: false})
        outlined!: boolean;
        @Prop({type: Boolean, default: true})
        clearable!: boolean;
        @Prop({type: Boolean, default: false})
        persistentHint!: boolean;
        @Prop({type: String, default: ""})
        hint!: string;
        @Prop({type: String, default: ""})
        label!: string;
        @Prop({type: Array, default: () => []})
        rules!: { (v: string): string | boolean; } []; // eslint-disable-line

        day: string | null = null;
        time: string | null = null;
        error = false;
        errorMessages = "";
        dateFilled = (): string | boolean => this.checkBothFieldsFilled() || 'Datum und Zeit muss ausgefüllt werden'


        get validierungsRegeln(): { (v: string): string | boolean; } [] {  // eslint-disable-line
            if (this.rules) {
                return [...this.rules, this.dateFilled];
            } else {
                return [this.dateFilled];
            }
        }

        mounted(): void {
            this.parseValue();
        }

        clear(): void {
            this.errorMessages = "";
            this.time = null;
            this.day = null;
            this.$emit('input', this.getDate());
        }

        getDate(): string | null {
            if (this.day && this.time) {
                this.error = false;
                this.errorMessages = "";
                return new Date(this.day + 'T' + this.time).toISOString();
            }

            return null;
        }

        @Watch('value')
        parseValue(): void {
            if (this.value) {
                const newDate = new Date(this.value);
                this.day = this.parseDay(newDate);
                this.time = this.parseTime(newDate);
            } else {
                this.day = null;
                this.time = null;
            }
        }

        parseDay(timestamp: Date): string {
            return timestamp.toISOString().replace(/T.*/, '');
        }

        parseTime(timestamp: Date): string {
            return timestamp.toLocaleTimeString(navigator.language, {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        leaveInput(): void {
            if (!this.checkBothFieldsFilled()) {
                this.error = true;
                this.errorMessages = "Datum und Zeit muss ausgefüllt werden";
            }
        }

        enterInput(): void {
            if (!this.checkBothFieldsFilled()) {
                this.error = false;
                this.errorMessages = "";
            }
        }

        sendInput(): void {
            if (this.checkBothFieldsFilled()) {
                this.$emit('input', this.getDate());
            }
        }

        checkBothFieldsFilled(): boolean {
            return !!(this.time && this.day) || (!this.time && !this.day);
        }
    }
    
</script>