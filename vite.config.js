import { defineConfig } from "vite";

export default defineConfig({
  base: "/Dominik_Sadzik/",
  server: {
    port: 5173,
    strictPort: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
