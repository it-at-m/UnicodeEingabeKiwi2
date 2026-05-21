import GraphemerImport from "graphemer";

/** CJS/ESM interop for graphemer (required with Vite 8 / Rolldown). */
const Graphemer: typeof GraphemerImport = (() => {
  const value: unknown = GraphemerImport;
  if (typeof value === "function") {
    return value as typeof GraphemerImport;
  }
  if (value && typeof value === "object" && "default" in value) {
    const inner = (value as { default: unknown }).default;
    if (typeof inner === "function") {
      return inner as typeof GraphemerImport;
    }
    if (inner && typeof inner === "object" && "default" in inner) {
      const nested = (inner as { default: unknown }).default;
      if (typeof nested === "function") {
        return nested as typeof GraphemerImport;
      }
    }
  }
  throw new Error("graphemer: could not resolve constructor");
})();

export default Graphemer;
