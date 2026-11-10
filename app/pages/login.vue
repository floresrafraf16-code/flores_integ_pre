
<template>
  <v-app class="login-app">
    <v-main class="login-background">
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card
          width="400"
          max-width="100%"
          class="pa-6 rounded-xl login-card"
          elevation="4"
        >
          <v-card-title class="text-center text-h5">
            Login
          </v-card-title>

          <v-card-text>
            <v-btn
              block
              color="primary"
              size="large"
              prepend-icon="mdi-google"
              @click="loginWithGoogle"
            >
              Sign in with Google
            </v-btn>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  layout: false
})

const config = useRuntimeConfig()

const googleClientId = config.public.googleClientId

declare global {
  interface Window {
    google: any
  }
}

const loginWithGoogle = () => {
  if (!googleClientId) {
    console.error('Google Client ID is missing!')
    alert('Google Client ID is missing. Check your environment variables.')
    return
  }

  if (!window.google?.accounts?.oauth2) {
    console.error('Google Identity Services not loaded!')
    alert('Google login is not ready. Please refresh.')
    return
  }

  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: googleClientId,
    scope: 'openid email profile',

    callback: async (response: any) => {
      if (response.error) {
        console.error('Google OAuth Error:', response)
        alert('Google authentication failed: ' + response.error)
        return
      }

      try {
        const userInfo = await $fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`
            }
          }
        )

        localStorage.setItem(
          'google_user',
          JSON.stringify(userInfo)
        )

        localStorage.setItem(
          'google_token',
          response.access_token
        )

        window.dispatchEvent(
          new Event('google-user-updated')
        )

        await navigateTo('/')

      } catch (error) {
        console.error('User information error:', error)
        alert('Unable to retrieve Google account information.')
      }
    }
  })

  client.requestAccessToken()
}
</script>

<style>
html,
body,
#__nuxt {
  min-height: 100%;
  margin: 0;
  background-color: #000000 !important;
}

.login-app,
.login-background {
  min-height: 100vh;
  background-color: #000000 !important;
}

.login-card {
  background-color: #ffffff !important;
  color: #000000 !important;
}
</style>
