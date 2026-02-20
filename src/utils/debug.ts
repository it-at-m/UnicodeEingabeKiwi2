// Debug utility that won't be stripped in production
export const debug = {
  log: (message: string, data?: any) => {
    try {
      console.log(`[KIWI_DEBUG] ${message}`, data);
    } catch (e) {
      // Fail silently if console is not available
    }
  },
};
