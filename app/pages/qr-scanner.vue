<template>
  <div class="mx-auto d-flex justify-center align-center" style="height:  90vh;">
    <v-card>
      <v-card-text>
        <!-- Show QR Scanner -->
        <video ref="videoRef" class="qr-video"></video>

        <!-- Start QR Scanner -->
         <v-btn block color="black" class="mt-2" @click="startScanner" >Start Scanner</v-btn>
         
        
        <!-- Start QR Scanner -->
        <v-btn block color="red" class="mt-2">Stop Scanner</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
//@ts-nocheck
import QrScanner from 'qr-scanner';

const videoRef = ref<HTMLVideoElement | null >(null)
let scanner: QrScanner | null = null

  const startScanner = async () => {
    if (!videoRef.value) return

    scanner = new QrScanner(
      videoRef.value,
      (scanResult) => {
        //result.value = scanResult.data 
        //emit('scanned', scanResult.data)

        //optional: stop after successful scan
        scanner?.stop()

      },
      {
        preferedCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    )
    await scanner.start()
  }
</script>

<style scope>
.qr-video{
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  background: black;
 
}
</style>