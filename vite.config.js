import { defineConfig } from "vite";

export default defineConfig({
  base: "/Dominik_Sadzik/",
  test: {
    environment: "jsdom",
    globals: true,
  },
});
