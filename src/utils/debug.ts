// Debug utility that won't be stripped in production
export const debug = {
  log: (message: string, data?: unknown) => {
    try {
      console.debug(`[KIWI_DEBUG] ${message}`, data);
    } catch {
      // Fail silently if console is not available
    }
  },
};
