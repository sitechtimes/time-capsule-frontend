import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:8000"
    }
  },
  srcDir: "app/",
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt"],
  vite: {
    plugins: [tailwindcss()]
  },
  css: ["~/assets/main.css"]
});
