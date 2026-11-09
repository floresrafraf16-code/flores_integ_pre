
<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="400" class="pa-6 rounded-xl">
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
</template>

<script setup lang="ts">
// @ts-nocheck

definePageMeta({
  layout: false
})

const config = useRuntimeConfig()

// Check Google Client ID
const googleClientId = config.public.googleClientId

console.log('========== GOOGLE AUTH DEBUG ==========')
console.log('Google Client ID:', googleClientId)
console.log('Client ID exists:', !!googleClientId)
console.log('=======================================')

declare global {
  interface Window {
    google: any
  }
}

const loginWithGoogle = () => {
  if (!googleClientId) {
    console.error('ERROR: Google Client ID is missing!')
    alert('Google Client ID is missing. Check your .env file.')
    return
  }

  if (!window.google?.accounts?.oauth2) {
    console.error('ERROR: Google Identity Services not loaded!')
    alert('Google login is not ready. Please refresh.')
    return
  }

  console.log('Starting Google authentication...')

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

        console.log('Google User:', userInfo)

        localStorage.setItem(
          'google_user',
          JSON.stringify(userInfo)
        )

        localStorage.setItem(
          'google_token',
          response.access_token
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
