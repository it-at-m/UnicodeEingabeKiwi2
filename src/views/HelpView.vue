<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h3 font-weight-bold mb-6" v-html="$t('help.title')"></h1>

        <h2 class="text-h4 mb-4">{{ $t('help.background.title') }}</h2>
        <p class="text-body-1 mb-4" v-html="$t('help.background.paragraph1')"></p>
        <p class="text-body-1 mb-6" v-html="$t('help.background.paragraph2')"></p>

        <h2 class="text-h4 mb-4">{{ $t('help.concept.title') }}</h2>
        <p class="text-body-1 mb-4" v-html="$t('help.concept.paragraph1')"></p>
        <p class="text-body-1 mb-4" v-html="$t('help.concept.paragraph2')"></p>
        <p class="text-body-1 mb-4" v-html="$t('help.concept.paragraph3')"></p>

        <h2 id="example" class="text-h4 mb-4">{{ $t('help.example.title') }}</h2>
        <p class="text-body-1 mb-4">{{ $t('help.example.description') }}</p>
        <v-list class="mb-6">
          <v-list-item v-for="(step, index) in $tm('help.example.steps')" :key="index">
            <div class="text-body-1" v-html="step"></div>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-row class="mt-8">
      <v-col class="d-flex justify-center">
        <v-img
          src="/images/kiwi.gif"
          alt="Kiwi Bird Animation"
          width="100%"
          contain
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// No setup needed
</script>

<style scoped>
:deep(a) {
  color: inherit;
  text-decoration: underline;
}

:deep(em) {
  font-style: italic;
}

:deep(strong) {
  font-weight: bold;
}

.v-list-item {
  padding: 8px 0;
}
</style>
