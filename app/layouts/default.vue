
<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      color="black"
      temporary
    >
      <v-list>
        <v-list-item
          :prepend-avatar="userPicture"
          :subtitle="userEmail"
          :title="userName"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          to="/"
          @click="drawer = false"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-qrcode-scan"
          title="QR Scanner"
          to="/qr-scanner"
          @click="drawer = false"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-weather-partly-cloudy"
          title="Weather App"
          to="/weather"
          @click="drawer = false"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar color="black" elevation="1">
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          class="hover-icon"
          @click="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>SCAN ME</v-app-bar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const drawer = ref(false)

// Default account information
const userName = ref('Guest User')
const userEmail = ref('No email available')
const userPicture = ref('/raf.jpg')

// Load logged-in Google account
const loadUser = () => {
  const savedUser = localStorage.getItem('google_user')

  if (savedUser) {
    try {
      const user = JSON.parse(savedUser)

      // Dynamic Google account information
      userName.value =
        user.name ||
        user.displayName ||
        user.given_name ||
        'Guest User'

      userEmail.value =
        user.email ||
        'No email available'

      userPicture.value =
        user.picture ||
        user.avatar ||
        user.image ||
        '/raf.jpg'

    } catch (error) {
      console.error('Error loading Google user:', error)
    }
  } else {
    userName.value = 'Guest User'
    userEmail.value = 'No email available'
    userPicture.value = '/raf.jpg'
  }
}

// Listen for successful login
const handleUserUpdate = () => {
  loadUser()
}

// Listen for account changes in other tabs
const handleStorageChange = (event: StorageEvent) => {
  if (event.key === 'google_user') {
    loadUser()
  }
}

// Initialize account information
onMounted(() => {
  loadUser()

  window.addEventListener(
    'google-user-updated',
    handleUserUpdate
  )

  window.addEventListener(
    'storage',
    handleStorageChange
  )
})

// Remove event listeners
onBeforeUnmount(() => {
  window.removeEventListener(
    'google-user-updated',
    handleUserUpdate
  )

  window.removeEventListener(
    'storage',
    handleStorageChange
  )
})
</script>

<style scoped>
.hover-icon {
  border-radius: 50%;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.hover-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.08);
}
</style>
