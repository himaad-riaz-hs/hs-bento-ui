import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/hs-bento-ui/",
  root: ".",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: "dist-annotated",
    rollupOptions: {
      input: fileURLToPath(new URL("./standalone-annotated.html", import.meta.url)),
    },
  },
  server: {
    port: 5174,
    open: "standalone-annotated.html",
  },
});
