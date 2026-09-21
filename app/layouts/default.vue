<template>
  <v-app>
      <v-navigation-drawer
        expand-on-hover
        permanent
        rail
        color="black"
      >
        <v-list>
          <v-list-item
            prepend-avatar="https://www.googleapis.com/oauth2/v3/userinfo"
            subtitle="floresrafraf16@gmail.com"
            title="Rafael Flores"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi mdi-view-dashboard" title="Dashboard" value="myfiles"></v-list-item>
          <v-list-item prepend-icon="mdi mdi-qrcode-scan" title="QR Scanner" value="shared"></v-list-item>
          <v-list-item prepend-icon="mdi mdi-weather-partly-cloudy" title="Weather" value="starred"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar color="black">
    <template v-slot:prepend>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>Application Bar</v-app-bar-title>
  </v-app-bar>

         <slot />
      <v-main style="height: 250px"></v-main>
  </v-app>
</template>