<template>
  <div class="VPSocialLink">
    <v-btn
      variant="text"
      class="text-none"
      icon
      :href="href"
      target="_blank"
      rel="noopener noreferrer"
    >
      <v-icon :icon="mdiGithub" />
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { mdiGithub } from '@mdi/js'

defineProps<{
  href: string
}>()
</script>

<style scoped>
.VPSocialLink {
  display: flex;
  align-items: center;
  margin-left: 8px;
}
</style> 