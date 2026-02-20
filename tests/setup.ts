/**
 * Vitest setup: ensure localStorage is available and has correct shape
 * so @vue/devtools-kit (pulled in by Vite/Vue) does not throw in test runs.
 */
function ensureLocalStorage() {
  const g = globalThis as unknown as { localStorage?: Storage };
  if (g.localStorage?.getItem && typeof g.localStorage.getItem === "function")
    return;

  const storage = new Map<string, string>();
  g.localStorage = {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, value);
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => {
      storage.clear();
    },
    key: (i: number) => [...storage.keys()][i] ?? null,
    get length() {
      return storage.size;
    },
  };
}

ensureLocalStorage();
