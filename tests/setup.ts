/**
 * Vitest setup: ensure localStorage is available and has correct shape
 * so @vue/devtools-kit (pulled in by Vite/Vue) does not throw in test runs.
 */
function ensureLocalStorage() {
  const g = globalThis as unknown as { localStorage?: Storage };
  if (g.localStorage?.getItem && typeof g.localStorage.getItem === "function")
    return;

  const storage: Record<string, string> = {};
  g.localStorage = {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => {
      storage[key] = value;
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
    clear: () => {
      for (const k of Object.keys(storage)) delete storage[k];
    },
    key: (i: number) => Object.keys(storage)[i] ?? null,
    get length() {
      return Object.keys(storage).length;
    },
  };
}

ensureLocalStorage();
