<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      color="black"
      @mouseenter="drawer = true"
      @mouseleave="drawer = false"
    >
      <v-list>
        <v-list-item
          prepend-avatar="/raf.jpg"
          subtitle="floresrafraf16@gmail.com"
          title="Rafael Flores"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi mdi-view-dashboard" title="Dashboard" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi mdi-qrcode-scan" title="QR Scanner" to="qr-scanner"></v-list-item>
        <v-list-item prepend-icon="mdi mdi-weather-partly-cloudy" title="Weather App" to="weather"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="black" elevation="1">
      <template v-slot:prepend>
        <v-app-bar-nav-icon 
          class="hover-icon" 
          @mouseenter="drawer = true"
        ></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>SCAN ME</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
  }),
}
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