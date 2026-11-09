<template>
  <div class="weather-wrapper pa-3 pa-md-6">
    <div class="weather-container">
      
      <div class="d-flex flex-column flex-sm-row justify-space-between align-center mb-4 ga-3">
        <div class="search-box-wrapper">
          <v-text-field
            v-model="searchQuery"
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            density="compact"
            hide-details
            clearable
            class="search-input glass-card"
            :loading="loading"
            @keyup.enter="handleSearch"
          />
        </div>

        <div 
          class="location-badge glass-card d-flex align-center px-4 py-2" 
          @click="searchDialog = true"
          role="button"
        >
          <v-icon icon="mdi-map-marker" color="#4fc3f7" class="mr-2" size="18" />
          <span class="text-body-2 text-sm-body-1 text-white font-weight-medium">
            {{ weatherData?.location ? `${weatherData.location.name}, ${weatherData.location.region || weatherData.location.country}` : 'San Fernando, Pampanga' }}
          </span>
        </div>
      </div>

      <v-slide-y-transition>
        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-3 text-white pa-2" closable @click:close="errorMessage = ''">
          {{ errorMessage }}
        </v-alert>
      </v-slide-y-transition>

      <div class="d-flex justify-space-between align-end mb-4">
        <div>
          <h1 class="text-h5 text-sm-h4 font-weight-bold text-white mb-1">Weather Today</h1>
          <p class="text-caption text-sm-subtitle-1 text-blue-grey-lighten-3 font-weight-regular mb-0">{{ formattedDate }}</p>
        </div>

        <div class="text-right">
          <h1 class="temp-display font-weight-bold text-white">
            {{ weatherData?.current?.temp_c !== undefined ? Math.round(weatherData.current.temp_c) : '29' }}°c
          </h1>
        </div>
      </div>

      <v-row class="mb-4">
        <v-col cols="12" sm="4">
          <v-card class="stat-card glass-card clickable-card pa-4 text-center" elevation="0">
            <v-icon icon="mdi-weather-rainy" color="#4fc3f7" size="32" class="mb-1" />
            <div class="text-h6 font-weight-bold text-white mb-0">
              {{ weatherData?.current?.chance_of_rain ?? 18 }}%
            </div>
            <div class="text-caption text-grey-lighten-1">Rain Chance</div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="4">
          <v-card class="stat-card glass-card clickable-card pa-4 text-center" elevation="0">
            <v-icon icon="mdi-weather-windy" color="#81d4fa" size="32" class="mb-1" />
            <div class="text-h6 font-weight-bold text-white mb-0">
              {{ weatherData?.current?.wind_kph ?? 6.5 }} km/h
            </div>
            <div class="text-caption text-grey-lighten-1">
              Wind ({{ weatherData?.current?.wind_dir || 'NNE' }})
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="4">
          <v-card class="stat-card glass-card clickable-card pa-4 text-center" elevation="0">
            <v-icon icon="mdi-water-percent" color="#90caf9" size="32" class="mb-1" />
            <div class="text-h6 font-weight-bold text-white mb-0">
              {{ weatherData?.current?.humidity ?? 71 }}%
            </div>
            <div class="text-caption text-grey-lighten-1">Humidity</div>
          </v-card>
        </v-col>
      </v-row>

      <v-expand-transition>
        <div v-if="selectedDetail" class="mb-4">
          <v-card class="glass-card detail-banner pa-3 d-flex align-center justify-space-between" elevation="0">
            <div class="d-flex align-center">
              <v-icon :icon="selectedDetail.icon" :color="selectedDetail.color" size="28" class="mr-3" />
              <div>
                <div class="text-caption text-grey-lighten-1 text-uppercase font-weight-bold">{{ selectedDetail.title }} Detail</div>
                <div class="text-subtitle-1 text-white font-weight-bold">{{ selectedDetail.value }}</div>
              </div>
            </div>
            <span class="text-caption text-blue-grey-lighten-2 d-none d-sm-inline">{{ selectedDetail.description }}</span>
          </v-card>
        </div>
      </v-expand-transition>

      <div>
        <div class="d-flex justify-space-between align-center mb-3">
          <h2 class="text-subtitle-1 font-weight-bold text-white mb-0">Current Highlights</h2>
          <span class="text-caption text-grey-lighten-1">Click a card to view details</span>
        </div>

        <v-row>
          <v-col 
            v-for="(card, index) in metricCards" 
            :key="index"
            cols="6" 
            sm="4" 
            md="2"
          >
            <v-card 
              class="stat-card glass-card pa-3 text-center clickable-card" 
              :class="{ 'active-card': activeCardIndex === index }"
              elevation="0"
              @click="selectCard(index, card)"
            >
              <div class="text-caption text-grey-lighten-1 mb-1 text-truncate">{{ card.title }}</div>
              <v-icon :icon="card.icon" :color="card.color" size="24" class="my-1" />
              <div class="text-subtitle-1 font-weight-bold text-white mt-1 text-truncate">{{ card.value }}</div>
            </v-card>
          </v-col>
        </v-row>
      </div>

    </div>

    <v-dialog v-model="searchDialog" max-width="450px">
      <v-card class="glass-dialog pa-5" elevation="0">
        <div class="d-flex justify-space-between align-center mb-3">
          <h3 class="text-subtitle-1 text-white font-weight-bold">Search City</h3>
          <v-btn icon="mdi-close" variant="text" size="small" color="white" @click="searchDialog = false" />
        </div>

        <v-text-field
          v-model="searchQuery"
          label="Enter city name"
          variant="outlined"
          density="comfortable"
          bg-color="rgba(255, 255, 255, 0.05)"
          color="#4fc3f7"
          class="text-white mb-3"
          hide-details
          @keyup.enter="handleSearch"
        />

        <v-btn
          block
          color="#4fc3f7"
          class="text-black font-weight-bold"
          rounded="lg"
          :loading="loading"
          @click="handleSearch"
        >
          Search
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
//@ts-nocheck
import { ref, computed, onMounted } from 'vue'

const weatherData = ref(null)
const searchDialog = ref(false)
const searchQuery = ref('')
const loading = ref(false)
const errorMessage = ref('')
const activeCardIndex = ref(0)
const selectedDetail = ref(null)

const formattedDate = computed(() => {
  if (!weatherData.value?.location?.localtime) return 'Monday, 26 October'
  const dateStr = weatherData.value.location.localtime.split(' ')[0]
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
})

const metricCards = computed(() => {
  const current = weatherData.value?.current
  return [
    {
      title: 'Current Temp',
      value: `${current?.temp_c ? Math.round(current.temp_c) : 29}°C`,
      icon: 'mdi-thermometer-lines',
      color: '#4fc3f7',
      description: `Actual air temperature in ${weatherData.value?.location?.name || 'San Fernando'}.`
    },
    {
      title: 'Condition',
      value: current?.condition?.text || 'Overcast',
      icon: 'mdi-weather-partly-cloudy',
      color: '#81d4fa',
      description: `Sky status is currently ${current?.condition?.text || 'Overcast'}.`
    },
    {
      title: 'Feels Like',
      value: `${current?.feelslike_c ? Math.round(current.feelslike_c) : 32}°C`,
      icon: 'mdi-thermometer',
      color: '#ffe082',
      description: `Apparent temperature accounting for humidity and wind.`
    },
    {
      title: 'Pressure',
      value: `${current?.pressure_mb || 1015} hPa`,
      icon: 'mdi-gauge',
      color: '#ffb74d',
      description: `Atmospheric pressure measured at sea level.`
    },
    {
      title: 'Visibility',
      value: `${current?.vis_km || 10} km`,
      icon: 'mdi-eye',
      color: '#b0bec5',
      description: `Horizontal distance at which objects can be clearly seen.`
    },
    {
      title: 'UV Index',
      value: `${current?.uv || 3.6}`,
      icon: 'mdi-white-balance-sunny',
      color: '#90caf9',
      description: `Solar ultraviolet radiation exposure level.`
    }
  ]
})

const selectCard = (index: number, card: any) => {
  activeCardIndex.value = index
  selectedDetail.value = card
}

const getWeather = async (city = 'San Fernando') => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await $fetch(`https://api.weatherapi.com/v1/current.json?key=bac6840566004e7e86c05854262610&q=${encodeURIComponent(city)}&aqi=no`)
    if (response) {
      weatherData.value = response
      searchDialog.value = false
      searchQuery.value = ''
      
      console.log('Successfully Fetched!', response)
      
      if (metricCards.value.length > 0) {
        selectCard(0, metricCards.value[0])
      }
    }
  } catch (err) {
    console.error('Failed to fetch weather data:', err)
    errorMessage.value = 'Could not fetch weather for this city. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (!searchQuery.value || !searchQuery.value.trim()) return
  getWeather(searchQuery.value.trim())
}

onMounted(() => {
  getWeather('San Fernando')
})
</script>

<style scoped>
:global(html),
:global(body),
:global(.v-application),
:global(.v-main) {
  background-color: #080d1a !important;
}

.weather-wrapper {
  width: 100%;
  min-height: calc(100vh - 64px);
  background: #080d1a !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.weather-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.search-box-wrapper {
  width: 100%;
  max-width: 320px;
}

:deep(.search-input .v-field) {
  background: rgba(255, 255, 255, 0.06) !important;
  color: white !important;
  border-radius: 30px !important;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

:deep(.search-input input) {
  color: white !important;
}

.glass-card {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border-radius: 16px !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-dialog {
  background: rgba(15, 22, 41, 0.95) !important;
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px !important;
}

.detail-banner {
  border-left: 4px solid #4fc3f7 !important;
  background: rgba(79, 195, 247, 0.08) !important;
}

.location-badge {
  border-radius: 30px !important;
  cursor: pointer;
  white-space: nowrap;
}

.location-badge:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.25);
}

.temp-display {
  font-size: 3.5rem;
  line-height: 1;
}

@media (min-width: 600px) {
  .temp-display {
    font-size: 4.8rem;
  }
}

@media (max-width: 960px) {
  .weather-wrapper {
    height: auto;
    min-height: 100vh;
    justify-content: flex-start;
  }
}

.clickable-card {
  cursor: pointer;
  transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.clickable-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.09) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4) !important;
}

.clickable-card.active-card {
  background: rgba(79, 195, 247, 0.18) !important;
  border: 1px solid rgba(79, 195, 247, 0.5) !important;
  box-shadow: 0 8px 24px 0 rgba(79, 195, 247, 0.25) !important;
}
</style>