<template>
  <div>
    <v-container
      fluid
    >
      <v-row
        v-if="compactView === false"
      >
        <h1 
          class="v-label"
        >
          {{ $t("history.panel_header") }}
        </h1>
      </v-row>
      <v-row>
        <br>TODO<br>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { Component, Prop } from 'vue-property-decorator';
    import { StringLatinModelService } from "../api/StringLatinModelService";

    @Component
    export default class History extends Vue {

        @Prop({type: StringLatinModelService, required: true})
        private readonly model!: StringLatinModelService;


        mounted(): void {
          console.debug("History.vue: mounted()");
          
        }

        //
        // Computed
        //
        get compactView(): boolean {
          return this.$store.state.config.compactView;
        }
    }
</script>

<style>
  @import '../../public/shared-styles.css';

  .v-label {
    color: black !important;
  }
</style>
