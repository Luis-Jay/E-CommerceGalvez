<template>
    <div class="address-search-map">
      <!-- Search Container -->
      <el-card class="search-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><LocationInformation /></el-icon>
            <span>Philippine Address Search</span>
          </div>
        </template>
        
        <div class="search-container">
          <el-input
            v-model="query"
            placeholder="Search address (e.g., Makati City, Manila)"
            size="large"
            :disabled="isLoading"
            @keyup.enter="searchAddress"
            @input="onInputChange"
            clearable
          >
            <template #prepend>
              <el-icon><Search /></el-icon>
            </template>
            <template #append>
              <el-button 
                type="primary" 
                @click="searchAddress"
                :loading="isLoading"
                :disabled="!query.trim()"
              >
                Search
              </el-button>
            </template>
          </el-input>
          
          <el-button
            type="success"
            size="large"
            @click="getCurrentLocation"
            :loading="isLoadingLocation"
            class="location-button"
          >
            <span style="display: inline-flex; align-items: center; gap: 8px;">
              <el-icon><Aim /></el-icon>
              Current Location
            </span>
          </el-button>

        </div>
  

      </el-card>
          <!-- Auto-suggestions Dropdown -->
          <div v-if="suggestions.length > 0" class="suggestions-container">
          <el-card class="suggestions-card" shadow="always">
            <div
              v-for="(suggestion, index) in suggestions"
              :key="index"
              @click="selectSuggestion(suggestion)"
              class="suggestion-item"
            >
              <el-icon class="suggestion-icon"><Location /></el-icon>
              <div class="suggestion-content">
                <div class="suggestion-main">{{ suggestion.structured_formatting?.main_text || suggestion.description }}</div>
                <div class="suggestion-secondary">{{ suggestion.structured_formatting?.secondary_text || '' }}</div>
              </div>
            </div>
          </el-card>
        </div>
      <!-- Map Container -->
      <el-card class="map-card" shadow="always">
        <div id="googleMap" style="height: 500px; width: 100%; border-radius: 8px;"></div>
        
        <!-- Loading Overlay -->
        <div v-if="isLoading" class="loading-overlay">
          <el-icon class="loading-icon is-loading"><Loading /></el-icon>
          <p class="loading-text">{{ loadingMessage }}</p>
        </div>
      </el-card>
  
      <!-- Search Results Info -->
      <el-card v-if="searchResults.length > 1" class="results-card" shadow="hover">
        <el-alert
          :title="`Found ${searchResults.length} results`"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <p>Showing the best match. Want to see all results?</p>
            <el-button size="small" type="primary" @click="showAllResults" class="show-all-btn">
              <el-icon><View /></el-icon>
              Show All Results
            </el-button>
          </template>
        </el-alert>
      </el-card>
  
      <!-- Success Message -->
      <el-alert
        v-if="successMessage"
        :title="successMessage"
        type="success"
        show-icon
        :closable="true"
        @close="clearSuccess"
        class="message-alert"
      />
  
      <!-- Error Message -->
      <el-alert
        v-if="errorMessage"
        :title="errorMessage"
        type="error"
        show-icon
        :closable="true"
        @close="clearError"
        class="message-alert"
      />
  
      <!-- Map Controls -->
      <el-card v-if="map" class="controls-card" shadow="hover">
        <el-space wrap>
          <el-button size="small" @click="clearAllMarkers">
            <el-icon><DeleteLocation /></el-icon>
            Clear Markers
          </el-button>
          <el-button size="small" @click="resetMapView">
            <el-icon><Refresh /></el-icon>
            Reset View
          </el-button>
          <el-switch
            v-model="showTraffic"
            @change="toggleTraffic"
            active-text="Traffic"
            size="large"
          />
          <el-switch
            v-model="showSatellite"
            @change="toggleMapType"
            active-text="Satellite"
            size="large"
          />
          <el-button size="small" @click="handleSaveAddress" type="success">
            <el-icon><Location></Location></el-icon>
          </el-button>
        </el-space>
      </el-card>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useAddressStore } from '@/stores/addressStore'
import {
  ElCard,
  ElInput,
  ElButton,
  ElIcon,
  ElAlert,
  ElSpace,
  ElSwitch,
  ElNotification
} from 'element-plus'
import {
  Search,
  Location,
  LocationInformation,
  Aim,
  Loading,
  View,
  DeleteLocation,
  Refresh
} from '@element-plus/icons-vue'
import debounce from 'lodash/debounce'
  
  // TODO: Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual Google Maps API key
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY
  
  // Google Maps types
  declare global {
    interface Window {
      google: any;
      initGoogleMaps: () => void;
    }
  }
  
  // Initialize address store
const addressStore = useAddressStore()

// Reactive state
const query = ref('')
const map = ref<any>(null)
const autocompleteService = ref<any>(null)
const placesService = ref<any>(null)
const geocoder = ref<any>(null)
const markers = ref<any[]>([])
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const isLoadingLocation = ref(false)
const loadingMessage = ref('')
const searchResults = ref<any[]>([])
const suggestions = ref<any[]>([])
const suggestionsTimeout = ref<number | null>(null)
const showTraffic = ref(false)
const showSatellite = ref(false)
const trafficLayer = ref<any>(null)
  
  // Philippine bounds for better search results
  const philippineBounds = {
    north: 21.3217806,
    south: 4.2158064,
    west: 114.0952145,
    east: 127.6062255
  }
  
  const loadGoogleMapsAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve(window.google)
        return
      }
  
      window.initGoogleMaps = () => {
        resolve(window.google)
      }
  
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`
      script.onerror = reject
      document.head.appendChild(script)
    })
  }
  
  const initializeMap = async () => {
    try {
      await loadGoogleMapsAPI()
  
      const mapOptions = {
        zoom: 6,
        center: { lat: 13.41, lng: 122.56 }, // Philippines center
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        restriction: {
          latLngBounds: philippineBounds,
          strictBounds: false
        },
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      }
  
      map.value = new window.google.maps.Map(
        document.getElementById('googleMap'),
        mapOptions
      )
  
      // Initialize services
      autocompleteService.value = new window.google.maps.places.AutocompleteService()
      placesService.value = new window.google.maps.places.PlacesService(map.value)
      geocoder.value = new window.google.maps.Geocoder()
  
      // Initialize traffic layer
      trafficLayer.value = new window.google.maps.TrafficLayer()
  
      // Add click event for reverse geocoding
      map.value.addListener('click', (event: any) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()
        reverseGeocode(lat, lng)
      })
  
      ElNotification({
        title: 'Map Ready',
        message: 'Google Maps loaded successfully!',
        type: 'success',
        duration: 2000
      })
  
    } catch (error) {
      showError('Failed to initialize Google Maps. Please check your API key.')
      console.error('Map initialization error:', error)
    }
  }
  
  const reverseGeocode = async (lat: number, lng: number) => {
    if (!geocoder.value) return
  
    try {
      isLoading.value = true
      loadingMessage.value = 'Getting location info...'
  
      const latlng = { lat, lng }
      
      geocoder.value.geocode({ location: latlng }, (results: any, status: any) => {
        isLoading.value = false
        
        if (status === 'OK' && results[0]) {
          const result = results[0]
          addMarker(lat, lng, result.formatted_address, true)
          query.value = result.formatted_address
          showSuccess('Location found!')
        } else {
          showError('No address found for this location')
        }
      })
  
    } catch (error) {
      isLoading.value = false
      showError('Failed to get location information')
      console.error(error)
    }
  }
  
  const onInputChange = () => {
    clearError()
    clearSuccess()
    
    if (suggestionsTimeout.value) {
      clearTimeout(suggestionsTimeout.value)
    }
    
    if (query.value.trim().length > 2) {
      suggestionsTimeout.value = setTimeout(() => {
        getSuggestions()
      }, 300)
    } else {
      suggestions.value = []
    }
  }
  
  const getSuggestions = async () => {
  if (!query.value.trim() || query.value.length < 3 || !autocompleteService.value) {
    console.log('getSuggestions early return:', { 
      query: query.value, 
      length: query.value.length, 
      autocompleteService: !!autocompleteService.value 
    })
    return
  }
  
  try {
    console.log('Getting suggestions for:', query.value)
    
    const request = {
      input: query.value,
      componentRestrictions: { country: 'ph' },
      types: ['geocode'],
      bounds: new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(philippineBounds.south, philippineBounds.west),
        new window.google.maps.LatLng(philippineBounds.north, philippineBounds.east)
      )
    }
    
    autocompleteService.value.getPlacePredictions(request, (predictions: any, status: any) => {
      console.log('Autocomplete response:', { status, predictionsCount: predictions?.length })
      
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        suggestions.value = predictions.slice(0, 5)
        console.log('Suggestions set:', suggestions.value.length)
      } else {
        suggestions.value = []
        console.log('No suggestions, status:', status)
      }
    })
  } catch (error) {
    console.error('getSuggestions error:', error)
    suggestions.value = []
  }
}
  
  const selectSuggestion = (suggestion: any) => {
    query.value = suggestion.description
    suggestions.value = []
    searchAddress()
  }
  
  const searchAddress = async () => {
    if (!query.value.trim()) {
      showError('Please enter an address to search')
      return
    }
  
    if (!geocoder.value) {
      showError('Map not initialized. Please refresh the page.')
      return
    }
  
    clearError()
    clearSuccess()
    suggestions.value = []
  
    try {
      isLoading.value = true
      loadingMessage.value = 'Searching for address...'
  
      const request = {
        address: query.value + ', Philippines',
        bounds: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(philippineBounds.south, philippineBounds.west),
          new window.google.maps.LatLng(philippineBounds.north, philippineBounds.east)
        ),
        componentRestrictions: { country: 'PH' }
      }
  
      geocoder.value.geocode(request, (results: any, status: any) => {
        isLoading.value = false
        
        if (status === 'OK' && results && results.length > 0) {
          searchResults.value = results
          clearAllMarkers()
  
          const bestResult = results[0]
          const position = bestResult.geometry.location
          const lat = position.lat()
          const lng = position.lng()
          
          // Center map on result
          map.value.setCenter(position)
          map.value.setZoom(15)
          
          // Add primary marker
          addMarker(lat, lng, bestResult.formatted_address, true)
          
          showSuccess(`Found: ${bestResult.formatted_address}`)
  
        } else {
          let errorMsg = 'Address not found. Try a different search term.'
          
          if (status === 'ZERO_RESULTS') {
            errorMsg = 'No results found. Please check your spelling or try a different address.'
          } else if (status === 'OVER_QUERY_LIMIT') {
            errorMsg = 'Too many requests. Please try again later.'
          } else if (status === 'REQUEST_DENIED') {
            errorMsg = 'Request denied. Please check your API key.'
          }
          
          showError(errorMsg)
        }
      })
  
    } catch (error) {
      isLoading.value = false
      showError('Error searching for address. Please check your internet connection and try again.')
      console.error(error)
    }
  }
  
  const showAllResults = () => {
    if (searchResults.value.length <= 1 || !map.value) return
    
    clearAllMarkers()
    const bounds = new window.google.maps.LatLngBounds()
    
    searchResults.value.forEach((result, index) => {
      const position = result.geometry.location
      const lat = position.lat()
      const lng = position.lng()
      
      addMarker(lat, lng, `${index + 1}. ${result.formatted_address}`, false, index + 1)
      bounds.extend(position)
    })
    
    map.value.fitBounds(bounds)
  }
  
  const addMarker = (lat: number, lng: number, title: string, isPrimary = false, number?: number) => {
    if (!map.value) return
  
    const position = { lat, lng }

    
  // clear existing marker
  markers.value.forEach(m => m.setMap(null))
  markers.value = []
    
    let icon
    if (isPrimary) {
      // Custom red marker for primary result
      icon = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#ff4444" stroke="white" stroke-width="3"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 16)
      }
    } else if (number) {
      // Numbered markers for multiple results
      icon = {
        url: `https://maps.google.com/mapfiles/ms/icons/blue-dot.png`,
        scaledSize: new window.google.maps.Size(32, 32)
      }
    }
    
      const marker = new window.google.maps.Marker({
    position,
    map: map.value,
    title,
    icon,
    animation: isPrimary ? window.google.maps.Animation.BOUNCE : null
  })

  
  // Mark primary marker for identification
  if (isPrimary) {
    ;(marker as any).isPrimary = true
  }
  
    // Stop bouncing after 2 seconds
    if (isPrimary) {
      setTimeout(() => {
        marker.setAnimation(null)
      }, 2000)
    }
    
    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; max-width: 300px; max-height:100px">
          <strong>${isPrimary ? '📍 Selected Location' : `Result ${number}`}</strong><br>
          <p style="margin: 8px 0; line-height: 1.4;">${title}</p>
          ${!isPrimary ? '<button onclick="selectThisResult(' + (number! - 1) + ')" style="background: #1976d2; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Select This</button>' : ''}
        </div>
      `
    })
    
    marker.addListener('click', () => {
      // Close all other info windows
      markers.value.forEach(m => m.infoWindow?.close())
      infoWindow.open(map.value, marker)
    })
    
    // Store reference to info window
    ;(marker as any).infoWindow = infoWindow
    
    // Auto-open for primary marker
    if (isPrimary) {
      setTimeout(() => {
        infoWindow.open(map.value, marker)
      }, 500)
    }
    
    markers.value.push(marker)
  }
  
  const clearAllMarkers = () => {
    markers.value.forEach(marker => {
      marker.setMap(null)
    })
    markers.value = []
  }
  
  const resetMapView = () => {
    if (!map.value) return
    
    map.value.setCenter({ lat: 13.41, lng: 122.56 })
    map.value.setZoom(6)
    clearAllMarkers()
  }
  
  const toggleTraffic = () => {
    if (!trafficLayer.value || !map.value) return
    
    if (showTraffic.value) {
      trafficLayer.value.setMap(map.value)
    } else {
      trafficLayer.value.setMap(null)
    }
  }
  
  const toggleMapType = () => {
  if (!map.value) return
  
  const mapType = showSatellite.value 
    ? window.google.maps.MapTypeId.SATELLITE 
    : window.google.maps.MapTypeId.ROADMAP
    
  map.value.setMapTypeId(mapType)
}

const SaveAddress = () => {
  if (!query?.value || !markers?.value) {
    showError('Internal error: Missing query or markers data.');
    return;
  }

  const currentAddress = query.value.trim();

  if (!currentAddress) {
    showError('Please search for an address or select a location on the map.');
    return;
  }

  if (!window.google || !window.google.maps || !window.google.maps.Animation) {
    showError('Google Maps API not loaded.');
    return;
  }

  const primaryMarker = markers.value.find((marker: any) =>
    marker.isPrimary || marker.getAnimation() === window.google.maps.Animation.BOUNCE
  );

  if (!primaryMarker) {
    showError('No location selected. Please click on the map or search for an address.');
    return;
  }

  const position = primaryMarker.getPosition();
  const lat = position.lat();
  const lng = position.lng();

  try {
    // Use address store to save address
    const savedAddress = addressStore.saveAddress({
      address: currentAddress,
      latitude: lat,
      longitude: lng
    });

    showSuccess('Address saved successfully!');
    console.log('Saved address:', savedAddress);
  } catch (error) {
    console.error('Error saving address:', error);
    showError(error instanceof Error ? error.message : 'Failed to save address. Please try again.');
  }
};

  
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your browser')
      return
    }
  
    isLoadingLocation.value = true
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Check if location is within Philippines bounds
        if (latitude < philippineBounds.south || latitude > philippineBounds.north ||
            longitude < philippineBounds.west || longitude > philippineBounds.east) {
          showError('Your location appears to be outside the Philippines')
          isLoadingLocation.value = false
          return
        }
        
        map.value?.setCenter({ lat: latitude, lng: longitude })
        map.value?.setZoom(16)
        await reverseGeocode(latitude, longitude)
        isLoadingLocation.value = false
      },
      (error) => {
        isLoadingLocation.value = false
        let errorMsg = 'Unable to get your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location access denied. Please enable location services.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMsg = 'Location request timed out.'
            break
        }
        
        showError(errorMsg)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }
  
  const showError = debounce((message: string) => {
  errorMessage.value = message
  ElNotification({
    title: 'Error',
    message,
    type: 'error',
    duration: 3000
  })
}, 1000) // 1 second delay before showing again
  
  const showSuccess = (message: string) => {
    successMessage.value = message
    ElNotification({
      title: 'Success',
      message,
      type: 'success',
      duration: 3000
    })
    setTimeout(() => { successMessage.value = '' }, 5000)
  }
  
  const clearError = () => {
    errorMessage.value = ''
  }
  
  const clearSuccess = () => {
  successMessage.value = ''
}

const handleSaveAddress = () => {
  SaveAddress()
}



const loadAddressOnMap = (address: any) => {
  if (!map.value) return
  
  const position = { lat: address.latitude, lng: address.longitude }
  
  // Clear existing markers
  clearAllMarkers()
  
  // Center map on saved address
  map.value.setCenter(position)
  map.value.setZoom(15)
  
  // Add marker for saved address
  addMarker(address.latitude, address.longitude, address.address, true)
  
  // Update query input
  query.value = address.address
  
  showSuccess('Address loaded on map!')
}

const deleteSavedAddress = (addressToDelete: string) => {
  try {
    addressStore.deleteAddress(addressToDelete)
    showSuccess('Address deleted successfully!')
  } catch (error) {
    console.error('Error deleting address:', error)
    showError(error instanceof Error ? error.message : 'Failed to delete address.')
  }
}

const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.suggestions-container') && !target.closest('.search-container')) {
    suggestions.value = []
  }
}
  
  // Global function for info window buttons
  ;(window as any).selectThisResult = (index: number) => {
    const result = searchResults.value[index]
    if (result) {
      clearAllMarkers()
      const position = result.geometry.location
      const lat = position.lat()
      const lng = position.lng()
      
      map.value.setCenter(position)
      map.value.setZoom(15)
      addMarker(lat, lng, result.formatted_address, true)
      query.value = result.formatted_address
      showSuccess('Location selected!')
    }
  }
  
  // Lifecycle
onMounted(async () => {
  await nextTick()
  
  // Initialize address store
  addressStore.initializeStore()
  
  await initializeMap()
  
  // Add click outside handler to close suggestions
  document.addEventListener('click', handleClickOutside)
})
  
  onUnmounted(() => {
  if (suggestionsTimeout.value) {
    clearTimeout(suggestionsTimeout.value)
  }
  // Clean up global function
  delete (window as any).selectThisResult
  // Remove click outside handler
  document.removeEventListener('click', handleClickOutside)
})
  </script>
  
  <style scoped>
  .address-search-map {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .search-card {
    margin-bottom: 20px;
    border-radius: 12px;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 18px;
    color: #409eff;
  }
  
  .search-container {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  
  .location-button {
    white-space: nowrap;
  }
  
  .suggestions-container {
    position: relative;
    margin-top: 8px;
  }
  
  .suggestions-card {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .suggestion-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s;
  }
  
  .suggestion-item:hover {
    background-color: #f5f7fa;
  }
  
  .suggestion-item:last-child {
    border-bottom: none;
  }
  
  .suggestion-icon {
    color: #409eff;
    flex-shrink: 0;
  }
  
  .suggestion-content {
    flex: 1;
    min-width: 0;
  }
  
  .suggestion-main {
    font-weight: 500;
    color: #303133;
    margin-bottom: 2px;
  }
  
  .suggestion-secondary {
    font-size: 12px;
    color: #909399;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .map-card {
    margin-bottom: 20px;
    border-radius: 12px;
    position: relative;
  }
  
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    border-radius: 12px;
  }
  
  .loading-icon {
    font-size: 40px;
    color: #409eff;
    margin-bottom: 16px;
  }
  
  .loading-text {
    color: #606266;
    font-size: 16px;
    margin: 0;
  }
  
  .results-card {
    margin-bottom: 20px;
    border-radius: 12px;
  }
  
  .show-all-btn {
    margin-top: 8px;
  }
  
  .message-alert {
    margin-bottom: 20px;
    border-radius: 8px;
  }
  
  .controls-card {
    border-radius: 12px;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .address-search-map {
      padding: 12px;
    }
    
    .search-container {
      flex-direction: column;
    }
    
    .location-button {
      align-self: stretch;
    }
    
    #googleMap {
      height: 400px !important;
    }
  }

  .gm-style-iw-d {
  padding-top: 0 !important;
}

  
  /* Element Plus customizations */
  :deep(.el-input-group__append) {
    padding: 0;
  }
  
  :deep(.el-input-group__append .el-button) {
    border-radius: 0 4px 4px 0;
    margin: 0;
  }
  
  :deep(.el-card__body) {
    padding: 20px;
  }
  
  :deep(.el-alert__content) {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
/* To this - more specific selector */
.loading-overlay .loading-icon.is-loading {
  animation: rotating 2s linear infinite;
}
  @keyframes rotating {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>