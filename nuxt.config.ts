export default defineNuxtConfig({
  compatibilityDate: '2026-09-29',

  modules: [],

  css: ['vuetify/styles'],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
  },
})