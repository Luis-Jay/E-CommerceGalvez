import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface PaymentMethod {
  id: string
  type: 'card' | 'digital'
  name: string
  isDefault: boolean
  createdAt: string
  
  // Card specific fields
  number?: string
  expiryDate?: string
  cvv?: string
  cardholderName?: string
  
  // Digital wallet specific fields
  accountInfo?: string
  paymentMethod?: 'gcash' | 'paymaya' | 'alipay'
}

export interface MaskedPaymentMethod {
  id: string
  type: 'card' | 'digital'
  name: string
  isDefault: boolean
  createdAt: string
  number?: string
  expiryDate?: string
  cardholderName?: string
  accountInfo?: string
  paymentMethod?: 'gcash' | 'paymaya' | 'alipay'
}

export const usePaymentMethodStore = defineStore('paymentMethod', () => {
  // State
  const savedPaymentMethods = ref<PaymentMethod[]>([])
  const isInitialized = ref(false)

  // Local Storage Key
  const STORAGE_KEY = 'digishop_payment_methods'

  // Computed
  const defaultPaymentMethod = computed(() => 
    savedPaymentMethods.value.find(method => method.isDefault) || null
  )

  const hasPaymentMethods = computed(() => 
    savedPaymentMethods.value.length > 0
  )

  const cardPaymentMethods = computed(() => 
    savedPaymentMethods.value.filter(method => method.type === 'card')
  )

  const hasEcashPayment = computed(() => {
    
    return savedPaymentMethods.value.some(method => method.type === 'digital')
  })

  const digitalPaymentMethods = computed(() => 
    savedPaymentMethods.value.filter(method => method.type === 'digital')
  )

  // Actions
  const initializeStore = () => {
    if (isInitialized.value) return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          savedPaymentMethods.value = parsed
        }
      }
    } catch (error) {
      console.error('Failed to load payment methods from localStorage:', error)
      savedPaymentMethods.value = []
    } finally {
      isInitialized.value = true
    }
  }

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPaymentMethods.value))
    } catch (error) {
      console.error('Failed to save payment methods to localStorage:', error)
      throw new Error('Failed to save payment method. Storage might be full.')
    }
  }

  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  const validatePaymentMethod = (paymentData: any): boolean => {
    // Basic validation
    if (!paymentData.name || paymentData.name.trim().length < 2) {
      throw new Error('Payment method name must be at least 2 characters long')
    }

    if (!['card', 'digital'].includes(paymentData.type)) {
      throw new Error('Invalid payment method type')
    }

    // Card validation
    if (paymentData.type === 'card') {
      if (!paymentData.number || paymentData.number.replace(/\s/g, '').length !== 16) {
        throw new Error('Card number must be 16 digits long')
      }

      if (!paymentData.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.expiryDate)) {
        throw new Error('Invalid expiry date format (MM/YY)')
      }

      if (!paymentData.cvv || !/^\d{3,4}$/.test(paymentData.cvv)) {
        throw new Error('CVV must be 3-4 digits')
      }

      if (!paymentData.cardholderName || paymentData.cardholderName.trim().length < 2) {
        throw new Error('Cardholder name is required')
      }

      // Check for duplicate card numbers
      const existingCard = savedPaymentMethods.value.find(
        method => method.type === 'card' && 
        method.number === paymentData.number && 
        method.id !== paymentData.id
      )
      if (existingCard) {
        throw new Error('This card is already saved')
      }
    }

    // Digital wallet validation
    if (paymentData.type === 'digital') {
      if (!paymentData.accountInfo || paymentData.accountInfo.trim().length < 5) {
        throw new Error('Account information must be at least 5 characters long')
      }

      if (!['gcash', 'paymaya', 'alipay'].includes(paymentData.paymentMethod)) {
        throw new Error('Invalid digital wallet type')
      }

      // Check for duplicate account info
      const existingAccount = savedPaymentMethods.value.find(
        method => method.type === 'digital' && 
        method.accountInfo === paymentData.accountInfo &&
        method.paymentMethod === paymentData.paymentMethod &&
        method.id !== paymentData.id
      )
      if (existingAccount) {
        throw new Error('This account is already saved')
      }
    }

    return true
  }

  const savePaymentMethod = (paymentData: any): PaymentMethod => {
    initializeStore()

    // Validate the payment method
    validatePaymentMethod(paymentData)

    // If this is set as default, remove default from others
    if (paymentData.isDefault) {
      savedPaymentMethods.value.forEach(method => {
        method.isDefault = false
      })
    }

    // Create the payment method object
    const newPaymentMethod: PaymentMethod = {
      id: generateId(),
      type: paymentData.type,
      name: paymentData.name.trim(),
      isDefault: paymentData.isDefault || savedPaymentMethods.value.length === 0,
      createdAt: new Date().toISOString(),
      ...(paymentData.type === 'card' ? {
        number: paymentData.number,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv, // Note: In production, don't store CVV
        cardholderName: paymentData.cardholderName
      } : {
        accountInfo: paymentData.accountInfo,
        paymentMethod: paymentData.paymentMethod
      })
    }

    // Add to the array
    savedPaymentMethods.value.push(newPaymentMethod)

    // Save to localStorage
    saveToLocalStorage()

    return newPaymentMethod
  }

  const updatePaymentMethod = (id: string, updateData: Partial<PaymentMethod>): PaymentMethod => {
    initializeStore()

    const methodIndex = savedPaymentMethods.value.findIndex(method => method.id === id)
    if (methodIndex === -1) {
      throw new Error('Payment method not found')
    }

    const currentMethod = savedPaymentMethods.value[methodIndex]
    const updatedMethod = { ...currentMethod, ...updateData }

    // Validate the updated method
    validatePaymentMethod(updatedMethod)

    // If setting as default, remove default from others
    if (updateData.isDefault) {
      savedPaymentMethods.value.forEach((method, index) => {
        if (index !== methodIndex) {
          method.isDefault = false
        }
      })
    }

    // Update the method
    savedPaymentMethods.value[methodIndex] = updatedMethod

    // Save to localStorage
    saveToLocalStorage()

    return updatedMethod
  }

  const deletePaymentMethod = (id: string): boolean => {
    initializeStore()

    const methodIndex = savedPaymentMethods.value.findIndex(method => method.id === id)
    if (methodIndex === -1) {
      throw new Error('Payment method not found')
    }

    const methodToDelete = savedPaymentMethods.value[methodIndex]
    const wasDefault = methodToDelete.isDefault

    // Remove the method
    savedPaymentMethods.value.splice(methodIndex, 1)

    // If the deleted method was default, set the first remaining method as default
    if (wasDefault && savedPaymentMethods.value.length > 0) {
      savedPaymentMethods.value[0].isDefault = true
    }

    // Save to localStorage
    saveToLocalStorage()

    return true
  }

  const setDefaultPaymentMethod = (id: string): boolean => {
    initializeStore()

    const method = savedPaymentMethods.value.find(method => method.id === id)
    if (!method) {
      throw new Error('Payment method not found')
    }

    // Remove default from all methods
    savedPaymentMethods.value.forEach(method => {
      method.isDefault = false
    })

    // Set the selected method as default
    method.isDefault = true

    // Save to localStorage
    saveToLocalStorage()

    return true
  }

  const getPaymentMethodById = (id: string): PaymentMethod | null => {
    initializeStore()
    return savedPaymentMethods.value.find(method => method.id === id) || null
  }

  const maskPaymentInfo = (method: PaymentMethod): MaskedPaymentMethod => {
    const masked: MaskedPaymentMethod = {
      id: method.id,
      type: method.type,
      name: method.name,
      isDefault: method.isDefault,
      createdAt: method.createdAt
    }

    if (method.type === 'card' && method.number) {
      // Mask card number (show only last 4 digits)
      const lastFour = method.number.slice(-4)
      masked.number = `**** **** **** ${lastFour}`
      masked.expiryDate = method.expiryDate
      masked.cardholderName = method.cardholderName
    } else if (method.type === 'digital' && method.accountInfo) {
      // Mask account info (show first 2 and last 2 characters)
      const account = method.accountInfo
      if (account.length > 4) {
        masked.accountInfo = account.slice(0, 2) + '*'.repeat(account.length - 4) + account.slice(-2)
      } else {
        masked.accountInfo = '*'.repeat(account.length)
      }
      masked.paymentMethod = method.paymentMethod
    }

    return masked
  }

  const clearAllPaymentMethods = (): void => {
    savedPaymentMethods.value = []
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear payment methods from localStorage:', error)
    }
  }

  const getPaymentMethodDisplayName = (method: PaymentMethod): string => {
    if (method.type === 'card') {
      const lastFour = method.number ? method.number.slice(-4) : '****'
      return `${method.name} (*${lastFour})`
    } else if (method.type === 'digital') {
      const walletName = method.paymentMethod?.toUpperCase() || 'Digital Wallet'
      return `${method.name} (${walletName})`
    }
    return method.name
  }

  const exportPaymentMethods = (): string => {
    initializeStore()
    // Export without sensitive data like CVV
    const exportData = savedPaymentMethods.value.map(method => ({
      id: method.id,
      type: method.type,
      name: method.name,
      isDefault: method.isDefault,
      createdAt: method.createdAt,
      ...(method.type === 'card' ? {
        number: method.number,
        expiryDate: method.expiryDate,
        cardholderName: method.cardholderName
      } : {
        accountInfo: method.accountInfo,
        paymentMethod: method.paymentMethod
      })
    }))
    
    return JSON.stringify(exportData, null, 2)
  }

  const importPaymentMethods = (jsonData: string): boolean => {
    try {
      const importedMethods = JSON.parse(jsonData)
      if (!Array.isArray(importedMethods)) {
        throw new Error('Invalid data format')
      }

      // Clear existing methods
      savedPaymentMethods.value = []

      // Import each method
      for (const methodData of importedMethods) {
        try {
          savePaymentMethod(methodData)
        } catch (error) {
          console.warn('Skipped invalid payment method during import:', error)
        }
      }

      return true
    } catch (error) {
      console.error('Failed to import payment methods:', error)
      throw new Error('Failed to import payment methods. Invalid data format.')
    }
  }

  return {
    // State
    savedPaymentMethods,
    isInitialized,

    // Computed
    defaultPaymentMethod,
    hasPaymentMethods,
    cardPaymentMethods,
    digitalPaymentMethods,
    hasEcashPayment,

    // Actions
    initializeStore,
    savePaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    getPaymentMethodById,
    maskPaymentInfo,
    clearAllPaymentMethods,
    getPaymentMethodDisplayName,
    validatePaymentMethod,
    exportPaymentMethods,
    importPaymentMethods
  }
})