// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GANTI sesuai nama repo GitHub-mu:
const repo = "SEP314STUDIO";

export default defineConfig({
  plugins: [react()],
  // GitHub Pages butuh base path ini (untuk asset, import.meta.env.BASE_URL, dll)
  base: `/${repo}/`,
});
