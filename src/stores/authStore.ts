import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { showMessageOnce } from '@/utils/showMessageOnce'
import type { CartItem } from '@/stores/cartStore'
import type { Order } from '@/stores/orderStore'
import { computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'

interface User {
  username: string
  password: string
  email: string
  phone: string
  address: string
  cartItems: CartItem[]
  orders: any[] // Changed from Order to any[] as Order type is not defined
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const loading = ref(false)
  const users = ref<User[]>([])
  const currentUserEmail = computed(() => localStorage.getItem('currentUserEmail'))
  const currentUser = computed(() => {
    const email = currentUserEmail.value
    if (!email) return null
    return users.value.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
  })
  
  const isAuthenticated = ref(
    JSON.parse(localStorage.getItem('isLoggedIn') || 'false')
  )

  // Dummy user (admin)
  const defaultUser: User = {
    username: 'admin',
    password: 'admin',
    email: 'admin@gmail.com',
    phone: '0909090909',
    address: '1234567890',
    cartItems: [],
    orders: []
  }

  // Initialize localStorage on first load
  const stored = localStorage.getItem('users')
  if (!stored) {
    localStorage.setItem('users', JSON.stringify([defaultUser]))
    localStorage.setItem('isLoggedIn', JSON.stringify(false))
    users.value = [defaultUser]
  } else {
    try {
      const parsed = JSON.parse(stored)
      users.value = Array.isArray(parsed) ? parsed : [parsed]
    } catch (error) {
      console.error('Error parsing users:', error)
    }
  }

  // Login method
  function loginUser(usernameInput: string, passwordInput: string): void {
    loading.value = true

    const trimmedUsername = usernameInput.trim().toLowerCase()
    const trimmedPassword = passwordInput.trim()

    if (!trimmedUsername && !trimmedPassword) {
      showMessageOnce('Please enter your username and password.', 'warning')
      loading.value = false
      return
    }

    if (!trimmedUsername) {
      showMessageOnce('Please enter your username.', 'warning')
      loading.value = false
      return
    }

    if (!trimmedPassword) {
      showMessageOnce('Please enter your password.', 'warning')
      loading.value = false
      return
    }

    const found = users.value.find(
      (user) =>
        user.email.trim().toLowerCase() === trimmedUsername &&
        user.password === trimmedPassword
    )

    if (found) {
      loading.value = true
      localStorage.setItem('isLoggedIn', JSON.stringify(true))
      localStorage.setItem('currentUserEmail', found.email)
      showMessageOnce('Login successful!', 'success')
      setTimeout(() => {
        router.push('/')
        window.location.reload()
      }, 1000)
    } else {
      showMessageOnce('Invalid username or password.', 'error')
    }

    setTimeout(() => {
      loading.value = false
    }, 1000)
  }

  function logout() {
    loading.value = false
    localStorage.setItem('isLoggedIn', JSON.stringify(false))
    localStorage.removeItem('currentUserEmail')
    showMessageOnce('Logout successful!', 'success')
    setTimeout(() => {
      router.push('/')
      window.location.reload()
    }, 1000)
  }

  function registerUser(user: User) {
    const existingUser = users.value.find(e => e.email === user.email)
    const existingPhone = users.value.find(e => e.phone === user.phone)
    const existingUsername = users.value.find(e => e.username === user.username)
    const existingPassword = users.value.find(e => e.password === user.password)

    if (existingUser) {
      showMessageOnce('Email already exists.', 'error')
      return
    }

    if (existingPhone) {
      showMessageOnce('Phone number already exists.', 'error')
      return
    }

    if (existingUsername) {
      showMessageOnce('Username already exists.', 'error')
      return
    }

    if (existingPassword) {
      showMessageOnce('Password already exists.', 'error')
      return
    }
    
    if (user.password.length < 8) {
      showMessageOnce('Password must be at least 8 characters long.', 'error')
      return
    }

    users.value.push(user)

    console.log('Users after push:', users.value)
    localStorage.setItem('users', JSON.stringify(users.value))
    console.log('Users in localStorage:', localStorage.getItem('users'))

    showMessageOnce('Registration successful! You can now login.', 'success')
    router.push('/')
    
  }

function addToUserCart(item: CartItem) {
  if (!currentUser.value) return

  // Ensure cartItems exists as an array
  if (!Array.isArray(currentUser.value.cartItems)) {
    currentUser.value.cartItems = []
  }

  // Add or update item
  const existing = currentUser.value.cartItems.find(i => i.id === item.id)
  if (existing) {
    existing.quantity += item.quantity
  } else {
    currentUser.value.cartItems.push(item)
  }

  // ✅ Sync to Pinia store
  const cart = useCartStore()
  cart.items = [...currentUser.value.cartItems]

  // ✅ Safely persist changes to localStorage
  try {
    const plainUsers = JSON.parse(JSON.stringify(users.value)) // strip refs
    localStorage.setItem('users', JSON.stringify(plainUsers))
  } catch (e) {
    console.error('Failed to persist users to localStorage:', e)
  }
}
  function removeItemFromUserCart(id: number) {
    if (!currentUser.value) return
    if (!Array.isArray(currentUser.value.cartItems)) currentUser.value.cartItems = []
    currentUser.value.cartItems = currentUser.value.cartItems.filter(i => i.id !== id)
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  function addUserOrder(order: any) {
    if (!currentUser.value) return
  
    if (!Array.isArray(currentUser.value.orders)) {
      currentUser.value.orders = []
    }
  
    currentUser.value.orders.push(order)
  
    // Sync to localStorage
    try {
      const plainUsers = JSON.parse(JSON.stringify(users.value))
      localStorage.setItem('users', JSON.stringify(plainUsers))
    } catch (e) {
      console.error('Failed to persist orders to localStorage:', e)
    }
  }

  

  return {
    users,
    loading,
    loginUser,
    isAuthenticated,
    logout,
    registerUser,
    currentUser,
    addToUserCart,
    removeItemFromUserCart,
    addUserOrder
  }
})
