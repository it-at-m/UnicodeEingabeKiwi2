<template>
  <v-snackbar
    v-model="themeStore.snackbar.show"
    :color="themeStore.snackbar.level"
    :timeout="themeStore.snackbar.timeout"
  >
    {{ themeStore.snackbar.message }}

    <template #actions>
    <v-btn
        color="white"
      variant="text"
        @click="themeStore.hideMessage()"
    >
        {{ $t('common.close') }}
    </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
</script>
