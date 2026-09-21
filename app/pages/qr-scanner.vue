<template>
  <div class="mx-auto d-flex justify-center align-center" style="height:  90vh;">
    <v-card>
      <v-card-text>
        <!-- Show QR Scanner -->
        <video class="qr-video"></video>

        <!-- Start QR Scanner -->
         <v-btn block color="black" class="mt-2">Start Scanner</v-btn>
        
        <!-- Start QR Scanner -->
        <v-btn block color="red" class="mt-2">Stop Scanner</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scope>
.qr-video{
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  background: black;
 
}
</style>