import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxt/fonts"],
  vite: {
    plugins: [tailwindcss()]
  },
  css: ["~/assets/main.css"]
});
