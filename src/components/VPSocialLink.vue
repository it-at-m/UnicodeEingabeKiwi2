<template>
  <div class="VPSocialLink">
    <a
      class="social-link"
      :href="href"
      :title="title"
      target="_blank"
      rel="noopener noreferrer"
    >
      <v-icon
        :icon="icon"
        size="20"
        class="social-link__icon"
      />
    </a>
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

/* Plain link avoids Vuetify 4 v-btn hover transforms on toolbar icons */
.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-decoration: none;
  vertical-align: middle;
}

.social-link:hover {
  background: rgba(var(--v-theme-on-surface), 0.08);
}

.social-link__icon {
  flex-shrink: 0;
}

.social-link__icon :deep(.v-icon__svg),
.social-link__icon :deep(svg) {
  transform: none !important;
  transition: none !important;
}
</style>
