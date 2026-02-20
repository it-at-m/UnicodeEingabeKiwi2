<template>
  <button
    class="VPSwitch VPSwitchAppearance"
    type="button"
    role="switch"
    :title="$t(theme === 'dark' ? 'theme.switchToLight' : 'theme.switchToDark')"
    :aria-checked="theme === 'dark'"
    @click="toggleTheme"
  >
    <span class="check">
      <span class="icon">
        <sun-icon
          class="vpi-sun"
          :class="{ 'is-active': theme === 'light' }"
        />
        <moon-icon
          class="vpi-moon"
          :class="{ 'is-active': theme === 'dark' }"
        />
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

import MoonIcon from "./icons/MoonIcon.vue";
import SunIcon from "./icons/SunIcon.vue";

const props = defineProps<{
  isDark: boolean;
}>();

type Emit = (e: "update:isDark", value: boolean) => void;
const emit = defineEmits<Emit>();

const theme = computed(() => (props.isDark ? "dark" : "light"));

function toggleTheme() {
  emit("update:isDark", !props.isDark);
}
</script>

<style scoped>
.VPSwitch {
  position: relative;
  border-radius: 11px;
  display: block;
  width: 40px;
  height: 22px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  transition: border-color 0.25s;
}

.VPSwitch:hover {
  border-color: var(--vp-c-gray);
}

.check {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--vp-c-gray-light-4);
  box-shadow: var(--vp-shadow-1);
  transition: transform 0.25s;
}

.dark .check {
  transform: translateX(18px);
}

.icon {
  position: relative;
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  overflow: hidden;
}

.icon :deep(svg) {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 12px;
  height: 12px;
  fill: var(--vp-c-text-2);
}

.vpi-sun {
  opacity: 1;
  transition: opacity 0.25s;
}

.vpi-moon {
  position: absolute;
  opacity: 0;
  transition: opacity 0.25s;
}

.dark .vpi-sun {
  opacity: 0;
}

.dark .vpi-moon {
  opacity: 1;
}

.dark .VPSwitch {
  background-color: var(--vp-c-bg-soft);
}
</style>
