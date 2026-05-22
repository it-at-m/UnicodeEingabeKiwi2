<template>
  <div class="VPSocialLink">
    <v-btn
      variant="text"
      class="text-none"
      icon
      :href="href"
      :title="title"
      target="_blank"
      rel="noopener noreferrer"
    >
      <v-icon :icon="icon" />
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { mdiGithub } from "@mdi/js";

withDefaults(
  defineProps<{
    href: string;
    icon?: string;
    title?: string;
  }>(),
  {
    icon: mdiGithub,
    title: "",
  }
);
</script>

<style scoped>
.VPSocialLink {
  display: flex;
  align-items: center;
  margin-left: 8px;
}
</style>
