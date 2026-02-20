<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="text-h3 font-weight-bold mb-6">
          {{ t("about.title.text") }} <em>{{ t("about.title.name") }}</em>
        </h1>

        <p class="text-body-1 mb-2">
          {{ copyrightYears }}
          <a
            :href="t('about.copyright.link.url')"
            v-html="t('about.copyright.link.text')"
          ></a>
        </p>
        <p class="text-body-1 mb-6">
          <em>{{ t("about.license.text.part1") }}</em>
          {{ t("about.license.text.part2") }}
          <em>{{ t("about.license.text.part3") }}</em>
        </p>

        <h2 class="text-h4 mb-4">
          {{ t("about.license.title.text") }}
          (<a
            :href="t('about.license.title.link.url')"
            target="mit"
            >{{ t("about.license.title.link.text") }}</a
          >)
        </h2>
        <v-card class="mb-6 pa-4">
          <pre
            class="text-body-2 mb-0"
            style="white-space: pre-wrap"
            >{{ licenseContent.title }}

{{ licenseContent.copyright }}

{{ licenseContent.permission }}

{{ licenseContent.notice }}

{{ licenseContent.warranty }}</pre
          >
        </v-card>

        <h2 class="text-h4 mb-4">{{ t("about.components.title") }}</h2>
        <v-list>
          <template
            v-for="dep in sortedDependencies"
            :key="dep.name"
          >
            <v-list-item>
              <template v-slot:default>
                <v-list-item-title class="font-weight-bold">
                  <a
                    :href="getPackageUrl(dep)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-decoration-none"
                  >
                    {{ dep.name }}
                    <v-icon
                      size="small"
                      color="primary"
                      >mdi-launch</v-icon
                    >
                  </a>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <span class="text-primary"
                    >v{{ dep.version.replace("^", "") }}</span
                  >
                  <span class="mx-2">•</span>
                  <span>{{ dep.license }}</span>
                  <span
                    v-if="dep.repository"
                    class="mx-2"
                    >•</span
                  >
                  <a
                    v-if="dep.repository"
                    :href="dep.repository"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-decoration-none text-caption"
                  >
                    {{ getRepositoryType(dep.repository) }}
                    <v-icon
                      size="x-small"
                      color="primary"
                      >mdi-git</v-icon
                    >
                  </a>
                  <span
                    v-if="dep.type"
                    class="mx-2"
                    >•</span
                  >
                  <span
                    v-if="dep.type"
                    class="text-caption"
                    >{{ dep.type }}</span
                  >
                </v-list-item-subtitle>
              </template>
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import packageJsonImport from "../../package.json";

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const packageJson = packageJsonImport as PackageJson;

interface Dependency {
  name: string;
  version: string;
  license: string;
  type: "dependency" | "devDependency";
  repository?: string;
  homepage?: string;
}

const { t } = useI18n();
const sortedDependencies = ref<Dependency[]>([]);

// Compute the copyright year range
const startYear = 2019;
const currentYear = new Date().getFullYear();
const copyrightYears = computed(() => {
  const endYear = currentYear.toString().slice(-2); // Get last 2 digits
  return `© Copyright ${startYear} - ${endYear}`;
});

// Replace {year} placeholder in license text with current year
const licenseContent = computed(() => ({
  title: t("about.license.content.title"),
  copyright: t("about.license.content.copyright").replace(
    "{year}",
    currentYear.toString()
  ),
  permission: t("about.license.content.permission"),
  notice: t("about.license.content.notice"),
  warranty: t("about.license.content.warranty"),
}));

// Known licenses and repository info for packages
const packageInfo: Record<
  string,
  { license: string; repository?: string; homepage?: string }
> = {
  "@fontsource/roboto": {
    license: "MIT",
    homepage: "https://fontsource.org",
  },
  "@mdi/js": {
    license: "Apache-2.0",
    repository: "https://github.com/Templarian/MaterialDesign-JS",
  },
  "@muenchen/prettier-codeformat": {
    license: "MIT",
    repository: "https://github.com/it-at-m/prettier-config",
  },
  "@tsconfig/node-lts": {
    license: "MIT",
    repository: "https://github.com/tsconfig/bases",
  },
  "@types/node": {
    license: "MIT",
    repository: "https://github.com/DefinitelyTyped/DefinitelyTyped",
  },
  "@vitejs/plugin-vue": {
    license: "MIT",
    repository: "https://github.com/vitejs/vite-plugin-vue",
  },
  "@vue/eslint-config-prettier": {
    license: "MIT",
    repository: "https://github.com/vuejs/eslint-config-prettier",
  },
  "@vue/eslint-config-typescript": {
    license: "MIT",
    repository: "https://github.com/vuejs/eslint-config-typescript",
  },
  "@vue/test-utils": {
    license: "MIT",
    repository: "https://github.com/vuejs/test-utils",
  },
  "@vue/tsconfig": {
    license: "MIT",
    repository: "https://github.com/vuejs/tsconfig",
  },
  "@vueuse/core": {
    license: "MIT",
    repository: "https://github.com/vueuse/vueuse",
  },
  eslint: {
    license: "MIT",
    repository: "https://github.com/eslint/eslint",
  },
  "eslint-plugin-vue": {
    license: "MIT",
    repository: "https://github.com/vuejs/eslint-plugin-vue",
  },
  jsdom: {
    license: "MIT",
    repository: "https://github.com/jsdom/jsdom",
  },
  pinia: {
    license: "MIT",
    repository: "https://github.com/vuejs/pinia",
  },
  prettier: {
    license: "MIT",
    repository: "https://github.com/prettier/prettier",
  },
  typescript: {
    license: "Apache-2.0",
    repository: "https://github.com/microsoft/TypeScript",
  },
  "unplugin-fonts": {
    license: "MIT",
    repository: "https://github.com/cssninjaStudio/unplugin-fonts",
  },
  vite: {
    license: "MIT",
    repository: "https://github.com/vitejs/vite",
  },
  "vite-plugin-vue-devtools": {
    license: "MIT",
    repository: "https://github.com/vuejs/devtools",
  },
  "vite-plugin-vuetify": {
    license: "MIT",
    repository: "https://github.com/vuetifyjs/vuetify-loader",
  },
  vitest: {
    license: "MIT",
    repository: "https://github.com/vitest-dev/vitest",
  },
  vue: {
    license: "MIT",
    repository: "https://github.com/vuejs/core",
  },
  "vue-i18n": {
    license: "MIT",
    repository: "https://github.com/intlify/vue-i18n-next",
  },
  "vue-router": {
    license: "MIT",
    repository: "https://github.com/vuejs/router",
  },
  "vue-tsc": {
    license: "MIT",
    repository: "https://github.com/vuejs/language-tools",
  },
  vuetify: {
    license: "MIT",
    repository: "https://github.com/vuetifyjs/vuetify",
  },
};

onMounted(() => {
  const deps: Dependency[] = [];

  // Process dependencies
  const processDependencies = (
    dependencies: Record<string, string>,
    type: "dependency" | "devDependency"
  ) => {
    for (const [name, version] of Object.entries(dependencies || {})) {
      const info = packageInfo[name] || { license: "Unknown" };
      deps.push({
        name,
        version: version.toString(),
        license: info.license,
        type,
        repository: info.repository,
        homepage: info.homepage,
      });
    }
  };

  processDependencies(packageJson.dependencies ?? {}, "dependency");
  processDependencies(packageJson.devDependencies ?? {}, "devDependency");

  // Sort dependencies alphabetically
  sortedDependencies.value = deps.sort((a, b) => a.name.localeCompare(b.name));
});

// Function to get the repository URL from package.json repository field
function getRepositoryUrl(
  repository: string | { url?: string } | undefined
): string | undefined {
  if (!repository) return undefined;
  if (typeof repository === "string") {
    if (repository.includes("/") && !repository.includes("://")) {
      return `https://github.com/${repository}`;
    }
    return repository;
  }
  if (typeof repository === "object" && repository.url) {
    return repository.url
      .replace("git+", "")
      .replace(/\.git$/, "")
      .replace("git://", "https://")
      .replace("ssh://git@", "https://");
  }
  return undefined;
}

// Function to get the package URL
const getPackageUrl = (dep: Dependency): string => {
  // If homepage is specified, use it
  if (dep.homepage) return dep.homepage;

  // If repository URL exists, use it (normalize from string or object)
  if (dep.repository) {
    const url = getRepositoryUrl(dep.repository);
    if (url) return url;
  }

  // Fallback to npm
  if (dep.name.startsWith("@")) {
    // Handle scoped packages (e.g. @fontsource/roboto -> @fontsource%2froboto)
    const [scope, packageName] = dep.name.split("/");
    return `https://www.npmjs.com/package/${scope}/${encodeURIComponent(packageName)}`;
  }

  return `https://www.npmjs.com/package/${encodeURIComponent(dep.name)}`;
};

// Function to get a friendly name for the repository type
const getRepositoryType = (url: string): string => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host === "github.com" || host.endsWith(".github.com")) return "GitHub";
    if (host === "gitlab.com" || host.endsWith(".gitlab.com")) return "GitLab";
    if (host === "bitbucket.org" || host.endsWith(".bitbucket.org"))
      return "Bitbucket";
  } catch {
    // Not a valid URL or parse failed; do not use substring matching (CodeQL)
  }
  return "Repository";
};
</script>

<style scoped>
a {
  color: inherit;
  text-decoration: underline;
}

a.text-decoration-none {
  text-decoration: none;
}

a:hover {
  opacity: 0.8;
}

em {
  font-style: italic;
}

strong {
  font-weight: bold;
}
</style>
