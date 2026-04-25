import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Котики Пазлы",
        short_name: "Пазлы",
        description: "Детские пазлы с мультяшными котиками",
        theme_color: "#ffcf5a",
        background_color: "#fff7d6",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        icons: []
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,json}"],
        cleanupOutdatedCaches: true
      }
    })
  ]
});
