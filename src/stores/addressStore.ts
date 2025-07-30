import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Address {
  address: string
  latitude: number
  longitude: number
  timestamp: string
  savedAt: string
}

interface User {
  id: string
  email: string
  username: string
  savedAddresses?: Address[]
}

export const useAddressStore = defineStore('address', () => {
  const users = ref<User[]>([])
  const currentUserEmail = ref<string | null>(null)

  // Initialize store from localStorage
  const initializeStore = () => {
    try {
      const usersData = localStorage.getItem('users')
      if (usersData) {
        users.value = JSON.parse(usersData)
      }
      
      const email = localStorage.getItem('currentUserEmail')
      currentUserEmail.value = email
    } catch (error) {
      console.error('Error initializing address store:', error)
    }
  }

  // Get current user
  const currentUser = computed(() => {
    if (!currentUserEmail.value) return null
    return users.value.find(user => user.email === currentUserEmail.value)
  })

  // Get current user's saved addresses
  const savedAddresses = computed(() => {
    return currentUser.value?.savedAddresses || []
  })

  // Save address for current user
  const saveAddress = (addressData: Omit<Address, 'timestamp' | 'savedAt'>) => {
    if (!currentUserEmail.value) {
      throw new Error('No user logged in')
    }

    const userIndex = users.value.findIndex(user => user.email === currentUserEmail.value)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const user = users.value[userIndex]
    
    // Initialize savedAddresses if not present
    if (!user.savedAddresses) {
      user.savedAddresses = []
    }

    // Create full address object
    const fullAddressData: Address = {
      ...addressData,
      timestamp: new Date().toISOString(),
      savedAt: new Date().toISOString()
    }

    // Check for duplicate address (case-insensitive)
    const existingIndex = user.savedAddresses.findIndex(addr =>
      addr.address.trim().toLowerCase() === addressData.address.trim().toLowerCase()
    )

    if (existingIndex !== -1) {
      // Update existing address
      user.savedAddresses[existingIndex] = fullAddressData
    } else {
      // Add new address
      user.savedAddresses.push(fullAddressData)
    }

    // Update user in array
    users.value[userIndex] = user

    // Save to localStorage
    try {
      localStorage.setItem('users', JSON.stringify(users.value))
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Local storage is full. Please remove some saved addresses.')
      }
      throw error
    }

    return fullAddressData
  }

  // Delete address for current user
  const deleteAddress = (addressToDelete: string) => {
    if (!currentUserEmail.value) {
      throw new Error('No user logged in')
    }

    const userIndex = users.value.findIndex(user => user.email === currentUserEmail.value)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const user = users.value[userIndex]
    
    if (!user.savedAddresses) {
      throw new Error('No saved addresses found')
    }

    // Remove address
    user.savedAddresses = user.savedAddresses.filter(addr => 
      addr.address !== addressToDelete
    )

    // Update user in array
    users.value[userIndex] = user

    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  // Get address by coordinates
  const getAddressByCoordinates = (lat: number, lng: number) => {
    return savedAddresses.value.find(addr => 
      addr.latitude === lat && addr.longitude === lng
    )
  }

  // Clear all addresses for current user
  const clearAllAddresses = () => {
    if (!currentUserEmail.value) {
      throw new Error('No user logged in')
    }

    const userIndex = users.value.findIndex(user => user.email === currentUserEmail.value)
    
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const user = users.value[userIndex]
    user.savedAddresses = []

    // Update user in array
    users.value[userIndex] = user

    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  // Update current user email
  const setCurrentUserEmail = (email: string | null) => {
    currentUserEmail.value = email
  }

  return {
    users,
    currentUserEmail,
    currentUser,
    savedAddresses,
    initializeStore,
    saveAddress,
    deleteAddress,
    getAddressByCoordinates,
    clearAllAddresses,
    setCurrentUserEmail
  }
}) 