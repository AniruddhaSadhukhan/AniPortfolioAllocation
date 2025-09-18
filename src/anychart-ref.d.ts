// This file ensures the AnyChart global namespace types are available across the app.
// We import types only, then map the existing global (loaded via script imports in main.ts).
import type * as anychartImport from "anychart";

declare global {
  // Provided at runtime by the script imports in main.ts
  // (anychart-base, anychart-sunburst, anychart-ui, etc.)
  const anychart: typeof anychartImport;
}

export {}; // ensure this file is treated as a module
