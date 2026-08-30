export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],
  runtimeConfig: {
    public: {
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID
    }
  }
})