<template>
  <div class="not-found-view">
    <v-container>
      <v-row justify="center">
        <v-col
          cols="12"
          md="8"
          class="text-center"
        >
          <h1 class="text-h3 font-weight-bold mb-4">
            {{ $t("notFound.title") }}
          </h1>
          <p class="text-body-1 mb-6">{{ $t("notFound.message") }}</p>
          <v-btn
            color="primary"
            :to="{ name: ROUTES_HOME }"
          >
            {{ $t("notFound.back") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ROUTES_HOME } from "@/constants";
</script>

<style scoped>
.not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - 64px);
  box-sizing: border-box;
  padding: 24px 0 10vh;
}
</style>
