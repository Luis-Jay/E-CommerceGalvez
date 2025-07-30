<template>
  <AppHeader />
  <div class="profile-container">
    <el-row :gutter="24">
      <!-- Sidebar Navigation -->
      <el-col :span="6">
        <div class="profile-sidebar">
          <div class="sidebar-header">
            <h3>Hello, {{ authStore.currentUser?.username || "User" }}</h3>
          </div>

          <el-menu
            :default-active="activeMenu"
            class="sidebar-menu"
            @select="handleMenuSelect"
          >
            <!-- Manage My Profile Section -->
            <el-sub-menu index="profile">
              <template #title>
                <el-icon><User /></el-icon>
                <span>Manage My Profile</span>
              </template>

              <el-menu-item index="manage-my-profile">
                <el-icon><Setting /></el-icon>
                <span>Manage My Profile</span>
              </el-menu-item>

              <el-menu-item index="address-book">
                <el-icon><Location /></el-icon>
                <span>Address Book</span>
              </el-menu-item>

              <el-menu-item index="payment-options">
                <el-icon><CreditCard /></el-icon>
                <span>My Payment Options</span>
              </el-menu-item>

              <el-menu-item index="lazada-wallet">
                <el-icon><Wallet /></el-icon>
                <span>Lazada Wallet</span>
              </el-menu-item>
            </el-sub-menu>

            <!-- My Orders Section -->
            <el-sub-menu index="orders">
              <template #title>
                <el-icon><ShoppingBag /></el-icon>
                <span>Orders</span>
              </template>

              <el-menu-item index="my-orders">
                <el-icon><ShoppingBag /></el-icon>
                <span>My Orders</span>
              </el-menu-item>

              <el-menu-item index="my-returns">
                <el-icon><RefreshLeft /></el-icon>
                <span>My Returns</span>
              </el-menu-item>

              <el-menu-item index="my-cancellations">
                <el-icon><Close /></el-icon>
                <span>My Cancellations</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
      </el-col>

      <!-- Main Content Area -->
      <el-col :span="18">
        <div class="profile-content">
          <div class="content-header">
            <h2>{{ currentPageTitle }}</h2>
            <p class="content-description">{{ currentPageDescription }}</p>
          </div>

          <!-- Dynamic Content Based on Selection -->
          <div class="content-body">
            <!-- Manage My Profile Content -->
            <div
              v-if="activeMenu === 'manage-my-profile'"
              class="manage-my-profile-section"
            >
              <el-row :gutter="20">
                <!-- Personal Profile -->
                <el-col :span="12">
                  <el-card class="manage-profile-card" v-if="!isEditMode">
                    <template #header>
                      <div class="card-header">
                        <span>Personal Profile</span>
                        <el-button
                          type="primary"
                          size="small"
                          @click="isEditMode = true"
                          >Edit</el-button
                        >
                      </div>
                    </template>
                    <el-descriptions column="1" border>
                      <el-descriptions-item label="Name">
                        {{ profileForm.firstName }} {{ profileForm.lastName }}
                      </el-descriptions-item>
                      <el-descriptions-item label="Email">
                        {{ maskedEmail }}
                      </el-descriptions-item>
                      <el-descriptions-item label="Phone">
                        {{ profileForm.phone }}
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-card>

                  <!-- Edit Profile Form -->
                  <el-card class="manage-profile-card" v-else>
                    <template #header>
                      <div class="card-header">
                        <span>Edit Personal Profile</span>
                        <div>
                          <el-button
                            type="primary"
                            size="small"
                            @click="saveProfile"
                            >Save</el-button
                          >
                          <el-button size="small" @click="isEditMode = false"
                            >Cancel</el-button
                          >
                        </div>
                      </div>
                    </template>
                    <el-form :model="profileForm" label-width="80px">
                      <el-form-item label="First Name">
                        <el-input v-model="profileForm.firstName" />
                      </el-form-item>
                      <el-form-item label="Email">
                        <el-input v-model="profileForm.email" />
                      </el-form-item>
                      <el-form-item label="Phone">
                        <el-input v-model="profileForm.phone" />
                      </el-form-item>
                    </el-form>
                  </el-card>
                </el-col>
                <!-- Address Book -->
                <el-col :span="12">
                  <!-- Saved Addresses Section -->
                  <el-card
                    v-if="addressStore.savedAddresses.length > 0"
                    class="saved-addresses-card"
                    shadow="hover"
                  >
                  <template #header>
                      <div
                        class="card-header"
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                        "
                      >
                        <div
                          style="display: flex; align-items: center; gap: 8px"
                        >
                          <el-icon><Location /></el-icon>
                          <span>Saved Addresses</span>
                        </div>
                        <el-button
                          size="small"
                          type="primary"
                          @click="openAddressDialog()"
                        >
                          <el-icon><Location /></el-icon>
                          Add Address
                        </el-button>
                      </div>
                    </template>

                    <div class="saved-addresses-list">
                      <div
                        v-for="(address, index) in addressStore.savedAddresses"
                        :key="index"
                        class="saved-address-item"
                      >
                        <div class="address-info">
                          <div class="address-text">{{ address.address }}</div>
                          <div class="address-meta">
                            <span
                              >Saved:
                              {{
                                new Date(address.savedAt).toLocaleDateString()
                              }}</span
                            >
                            <span
                              >Coordinates: {{ address.latitude.toFixed(4) }},
                              {{ address.longitude.toFixed(4) }}</span
                            >
                          </div>
                        </div>
                        <div class="address-actions">
                          <el-button
                            size="small"
                            type="primary"
                            @click="loadAddressOnMap(address)"
                          >
                            <el-icon><Location /></el-icon>
                            Load
                          </el-button>
                          <el-button
                            size="small"
                            type="danger"
                            @click="deleteSavedAddress(address.address)"
                          >
                            <el-icon><DeleteLocation /></el-icon>
                            Delete
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </el-card>

                  <!-- Empty State -->
                  <el-card v-else class="saved-addresses-card" shadow="hover">
                    <template #header>
                      <div
                        class="card-header"
                        style="
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                        "
                      >
                        <div
                          style="display: flex; align-items: center; gap: 8px"
                        >
                          <el-icon><Location /></el-icon>
                          <span>Saved Addresses</span>
                        </div>
                        <el-button
                          size="small"
                          type="primary"
                          @click="openAddressDialog()"
                        >
                          <el-icon><Location /></el-icon>
                          Add Address
                        </el-button>
                      </div>
                    </template>

                    <div class="empty-state">
                      <el-empty
                        description="No saved addresses yet. Search and save a location to see it here."
                        :image-size="100"
                      />
                    </div>
                  </el-card>
                </el-col>
              </el-row>

              <!-- Address Editor Dialog -->
              <el-dialog
                v-model="showAddressDialog"
                title="Edit Address"
                width="600px"
                :before-close="() => (showAddressDialog = false)"
              >
                <Address />
              </el-dialog>

              <!-- Recent Orders -->
              <el-row style="margin-top: 24px">
                <el-col :span="24">
                  <el-card class="manage-profile-card">
                    <template #header>
                      <div class="card-header">
                        <span>Recent Orders</span>
                      </div>
                    </template>
                    <el-table :data="recentOrders" style="width: 100%">
                      <el-table-column
                        prop="orderId"
                        label="Order ID"
                        width="120"
                      />
                      <el-table-column prop="date" label="Date" width="140" />
                      <el-table-column
                        prop="status"
                        label="Status"
                        width="120"
                      />
                      <el-table-column prop="total" label="Total" width="100" />
                      <el-table-column label="Action" width="120">
                        <template #default="scope">
                          <el-button type="text" size="small">View</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </el-col>
              </el-row>
            </div>

            <!-- Address Book Content -->
            <div v-if="activeMenu === 'address-book'" class="address-section">
              <!-- Saved Addresses Section -->
              <el-card
                v-if="addressStore.savedAddresses.length > 0"
                class="saved-addresses-card"
                shadow="hover"
              >
                <template #header>
                  <div class="card-header">
                    <el-icon><Location /></el-icon>
                    <span
                      >Saved Addresses ({{
                        addressStore.savedAddresses.length
                      }})</span
                    >
                  </div>
                </template>

                <div class="saved-addresses-list">
                  <div
                    v-for="(address, index) in addressStore.savedAddresses"
                    :key="index"
                    class="saved-address-item"
                  >
                    <div class="address-info">
                      <div class="address-text">{{ address.address }}</div>
                      <div class="address-meta">
                        <span
                          >Saved:
                          {{
                            new Date(address.savedAt).toLocaleDateString()
                          }}</span
                        >
                        <span
                          >Coordinates: {{ address.latitude.toFixed(4) }},
                          {{ address.longitude.toFixed(4) }}</span
                        >
                      </div>
                    </div>
                    <div class="address-actions">
                      <el-button
                        size="small"
                        type="primary"
                        @click="loadAddressOnMap(address)"
                      >
                        <el-icon><Location /></el-icon>
                        Load
                      </el-button>
                      <el-button
                        size="small"
                        type="danger"
                        @click="deleteSavedAddress(address.address)"
                      >
                        <el-icon><DeleteLocation /></el-icon>
                        Delete
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-card>

              <!-- Empty State -->
              <el-card v-else class="saved-addresses-card" shadow="hover">
                <template #header>
                  <div class="card-header">
                    <el-icon><Location /></el-icon>
                    <span>Saved Addresses</span>
                  </div>
                </template>

                <div class="empty-state">
                  <el-empty
                    description="No saved addresses yet. Search and save a location to see it here."
                    :image-size="100"
                  />
                </div>
              </el-card>
            </div>

            <!-- Payment Options Content -->
            <div
              v-if="activeMenu === 'payment-options'"
              class="payment-section"
            >
              <div class="section-actions" style="margin-bottom: 16px">
                <el-button type="primary" @click="openPaymentDialog()">
                  <el-icon><CreditCard /></el-icon>
                  Add Payment Method
                </el-button>
              </div>

              <el-card class="payment-card">
                <template #header>
                  <div class="card-header">
                    <span>Payment Methods</span>
                    <span v-if="maskedMethods.length > 0" class="method-count"
                      >({{ maskedMethods.length }})</span
                    >
                  </div>
                </template>

                

                <!-- Payment Methods List -->
                <div
                  v-if="maskedMethods.length > 0"
                  class="payment-methods-list"
                >
                  <div
                    v-for="method in maskedMethods"
                    :key="method.id"
                    class="payment-method-item"
                    :class="{ 'is-default': method.isDefault }"
                  >
                    <div class="method-info">
                      <div class="method-name">{{ method.name }}</div>
                      <div class="method-details">
                        <span v-if="method.type === 'card'">{{
                          method.number
                        }}</span>
                        <span v-else-if="method.type === 'digital'"
                          >{{ method.accountInfo }} ({{
                            method.paymentMethod?.toUpperCase()
                          }})</span
                        >
                      </div>
                      <div class="method-meta">
                        <span v-if="method.isDefault" class="default-badge"
                          >Default</span
                        >
                        <span class="added-date"
                          >Added:
                          {{
                            new Date(method.createdAt).toLocaleDateString()
                          }}</span
                        >
                      </div>
                    </div>
                    <div class="method-actions">
                      <el-button
                        v-if="!method.isDefault"
                        size="small"
                        @click="setAsDefault(method.id)"
                      >
                        Set Default
                      </el-button>
                      <el-button
                        size="small"
                        type="danger"
                        @click="deletePaymentMethod(method.id)"
                      >
                        Delete
                      </el-button>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else>
                  <el-empty description="No payment methods added yet" />
                </div>
              </el-card>
            </div>

            <PaymentMethod 
            :visible="showPaymentDialog"
              @close="showPaymentDialog = false"
              @paymentMethodAdded="handlePaymentSuccess"
            />

              <!-- Lazada Wallet Content -->
              <div v-if="activeMenu === 'lazada-wallet'" class="wallet-section">
                <el-card class="wallet-card">
                  <template #header>
                    <div class="card-header">
                      <span>Lazada Wallet</span>
                    </div>
                  </template>
  
                  <div class="wallet-balance">
                    <h3>Current Balance</h3>
                    <div class="balance-amount">₱0.00</div>
                    <el-button type="primary">Top Up Wallet</el-button>
                  </div>
                </el-card>
              </div>



            <!-- My Orders Content -->
            <div v-if="activeMenu === 'my-orders'" class="orders-section">
              <el-card class="orders-card">
                <template #header>
                  <div class="card-header">
                    <span>Orders</span>
                  </div>
                </template>
                <div class="orders-content">
                  <div
                    v-if="
                      !authStore.currentUser ||
                      !authStore.currentUser.orders ||
                      authStore.currentUser.orders.length === 0
                    "
                  >
                    <el-empty description="No orders found" />
                  </div>
                  <div v-else class="orders-list">
                    <el-timeline>
                      <el-timeline-item
                        v-for="order in authStore.currentUser.orders"
                        :key="order.orderId"
                        :timestamp="order.date"
                        placement="top"
                      >
                        <div class="order-item">
                          <h4>Order ID: {{ order.orderId }}</h4>
                          <p>Status: {{ order.status }}</p>
                          <p>Total: ₱{{ order.total.toFixed(2) }}</p>
                          <ul class="order-items-list">
                            <li v-for="item in order.items" :key="item.id">
                              {{ item.name }} (x{{ item.quantity }}) - ₱{{
                                item.currentPrice
                              }}
                            </li>
                          </ul>
                        </div>
                      </el-timeline-item>
                    </el-timeline>
                  </div>
                </div>
              </el-card>
            </div>

            <!-- My Returns Content -->
            <div v-if="activeMenu === 'my-returns'" class="returns-section">
              <el-card class="returns-card">
                <template #header>
                  <div class="card-header">
                    <span>Return Requests</span>
                  </div>
                </template>
                <el-empty description="No return requests found" />
              </el-card>
            </div>

            <!-- My Cancellations Content -->
            <div
              v-if="activeMenu === 'my-cancellations'"
              class="cancellations-section"
            >
              <el-card class="cancellations-card">
                <template #header>
                  <div class="card-header">
                    <span>Cancelled Orders</span>
                  </div>
                </template>
                <el-empty description="No cancelled orders found" />
              </el-card>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

  <el-footer class="footer-container">
    <AppFooter />
  </el-footer>
</template>
  


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useOrderStore } from '@/stores/orderStore'
import { useCartStore } from '@/stores/cartStore'
import { usePaymentMethodStore } from '@/stores/paymentMethodStore'
import type { MaskedPaymentMethod } from '@/stores/paymentMethodStore'
import {
  User,
  UserFilled,
  Location,
  CreditCard,
  Wallet,
  ShoppingBag,
  RefreshLeft,
  Close,
  Setting
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useAddressStore } from '@/stores/addressStore'
import Address from '@/components/address.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PaymentMethod from '@/components/PaymentMethod.vue'


// Store instances
const authStore = useAuthStore()
const addressStore = useAddressStore()
const paymentMethodStore = usePaymentMethodStore()
const cart = useCartStore()
const orderStore = useOrderStore()

// Reactive data
const activeMenu = ref('manage-my-profile')
const isEditMode = ref(false)
const showAddressDialog = ref(false)
const showPaymentDialog = ref(false)

// Get current user data
const users = JSON.parse(localStorage.getItem('users') || '[]')
const currentUserEmail = localStorage.getItem('currentUserEmail')
const currentUser = users.find((u: any) => u.email === currentUserEmail)

// Profile form data
const profileForm = ref({
  firstName: currentUser?.username || '',
  lastName: currentUser?.lastName || '',
  email: currentUser?.email || '',
  phone: currentUser?.phone || '',
  birthDate: currentUser?.birthDate || ''
})

// Store original form data for cancellation
const originalProfileForm = ref({ ...profileForm.value })

// Initialize stores on component mount
onMounted(() => {
  addressStore.initializeStore()
  paymentMethodStore.initializeStore()
})

// Create masked methods for display
const maskedMethods = computed<MaskedPaymentMethod[]>(() =>
  paymentMethodStore.savedPaymentMethods.map(method =>
    paymentMethodStore.maskPaymentInfo(method)
  )
)

// Computed properties for dynamic content
const currentPageTitle = computed(() => {
  const titles: Record<string, string> = {
    'manage-my-profile': 'Manage My Profile',
    'address-book': 'Address Book',
    'payment-options': 'Payment Options',
    'lazada-wallet': 'Lazada Wallet',
    'my-orders': 'My Orders',
    'my-returns': 'My Returns',
    'my-cancellations': 'My Cancellations',
  }
  return titles[activeMenu.value] || 'Manage My Profile'
})

const currentPageDescription = computed(() => {
  const descriptions: Record<string, string> = {
    'manage-my-profile': 'Manage your personal information and account settings',
    'address-book': 'Save and manage your delivery addresses',
    'payment-options': 'Add and manage your payment methods',
    'lazada-wallet': 'View your wallet balance and transaction history',
    'my-orders': 'Track your orders and order history',
    'my-returns': 'Track your return requests and refund status',
    'my-cancellations': 'View your cancelled orders and refund details',
  }
  return descriptions[activeMenu.value] || 'Manage your personal information'
})

// Masked email computed property
const maskedEmail = computed(() => {
  const email = profileForm.value.email
  if (!email) return ''
  const [name, domain] = email.split('@')
  if (!name || !domain) return email
  const maskedName = name[0] + '*'.repeat(Math.max(0, name.length - 2)) + (name.length > 1 ? name[name.length - 1] : '')
  return `${maskedName}@${domain}`
})

// Recent orders data
const recentOrders = computed(() => currentUser?.orders || [])

// Methods
const handleMenuSelect = (index: string) => {
  activeMenu.value = index
}

const saveProfile = () => {
  try {
    // Update the user data in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex((u: any) => u.email === currentUserEmail)
    
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        username: profileForm.value.firstName,
        lastName: profileForm.value.lastName,
        phone: profileForm.value.phone
      }
      localStorage.setItem('users', JSON.stringify(users))
    }
    
    // Update original form data
    originalProfileForm.value = { ...profileForm.value }
    isEditMode.value = false
    
    ElMessage.success('Profile updated successfully!')
    
    // Reload after a short delay to show the success message
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (error) {
    ElMessage.error('Failed to update profile')
    console.error('Error updating profile:', error)
  }
}

const cancelEdit = () => {
  // Restore original form data
  profileForm.value = { ...originalProfileForm.value }
  isEditMode.value = false
}

const openAddressDialog = () => {
  showAddressDialog.value = true
}

const closeAddressDialog = () => {
  showAddressDialog.value = false
}

const openPaymentDialog = () => {
  showPaymentDialog.value = true
  console.log(showPaymentDialog.value)
}

const closePaymentDialog = () => {
  showPaymentDialog.value = false
}

const loadAddressOnMap = (address: any) => {
  showAddressDialog.value = true
  // You can pass the address data to the Address component here
}

const deleteSavedAddress = async (addressToDelete: string) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this address?',
      'Delete Address',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    
    addressStore.deleteAddress(addressToDelete)
    ElMessage.success('Address deleted successfully!')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete address')
      console.error('Error deleting address:', error)
    }
  }
}

const handlePaymentSuccess = () => {
  showPaymentDialog.value = false
  ElMessage.success('Payment method added successfully!')
}

const setAsDefault = async (methodId: string) => {
  try {
    paymentMethodStore.setDefaultPaymentMethod(methodId)
    ElMessage.success('Default payment method updated!')
  } catch (error) {
    ElMessage.error('Failed to update default payment method')
    console.error('Error setting default payment method:', error)
  }
}

const deletePaymentMethod = async (methodId: string) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this payment method?',
      'Delete Payment Method',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    
    paymentMethodStore.deletePaymentMethod(methodId)
    ElMessage.success('Payment method deleted successfully!')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete payment method')
      console.error('Error deleting payment method:', error)
    }
  }
}

const getStatusType = (status: string) => {
  const statusTypes: Record<string, string> = {
    'Processing': 'warning',
    'Shipped': 'info',
    'Delivered': 'success',
    'Cancelled': 'danger',
    'Pending': 'info'
  }
  return statusTypes[status] || 'info'
}

const viewOrder = (order: any) => {
  // Implement order details view
  ElMessage.info(`Viewing order: ${order.orderId}`)
}

const checkout = () => {
  if (cart.items.length === 0) return

  const total = cart.items.reduce((acc, item) => acc + item.currentPrice * item.quantity, 0)
  orderStore.addOrder([...cart.items], total)
  cart.clearCart()
}

// Route handling
const route = useRoute()

// Initialize address store
addressStore.initializeStore()

watch(
  () => route.query.section,
  (section) => {
    if (Array.isArray(section)) {
      if (section.length > 0 && typeof section[0] === 'string' && section[0] !== null) {
        activeMenu.value = section[0]
      }
    } else if (typeof section === 'string' && section !== null) {
      activeMenu.value = section
    }
  },
  { immediate: true }
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=League+Spartan:wght@100..900&family=Manufacturing+Consent&display=swap');

* {
    font-family: 'Lato', sans-serif;
}

.footer-container {
    height: 70em;
    padding: 100px;
    text-align: center;
    font-family: 'Lato', sans-serif;
    font-size: 14px;
    background-color: #ffffff;
}



.profile-container {
  padding: 2rem;
  background-color: #f8f9fa;
}

.profile-sidebar {
  background: hite;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background: #f57224;
  color: white;
}

.sidebar-header h3 {
  margin: 0;
  font-family: 'League Spartan', sans-serif;
  font-weight: 600;
  font-size: 18px;
}

.sidebar-menu {
  border: none;
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  font-family: 'Lato', sans-serif;
  font-size: 14px;
  color: #333;
  height: 50px;
  line-height: 50px;
}
f57224
.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: #f0f2f5;
  color: #f57224;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: #e6f3ff;
  color: #f57224;
  border-right: 3px solid #f57224;
}

.profile-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

.content-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #eee;
}

.content-header h2 {
  margin: 0 0 0.5rem 0;
  font-family: 'League Spartan', sans-serif;
  font-weight: 600;
  color: #f57224;
  font-size: 24px;
}

.content-description {
  margin: 0;
  color: #666;
  font-family: 'Lato', sans-serif;
  font-size: 14px;
}

.content-body {
  padding: 2rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-family: 'League Spartan', sans-serif;
  font-weight: 600;
  color: #f57224;
  font-size: 16px;
}

/* Consistent styling for all content sections */
.profile-section,
.address-section,
.payment-section,
.wallet-section,
.returns-section,
.cancellations-section,
.orders-section {
  width: 100%;
}

.profile-card,
.address-card,
.payment-card,
.wallet-card,
.orders-card,
.returns-card,
.cancellations-card {
  margin-bottom: 1rem;
  width: 100%;
}

.wallet-balance {
  text-align: center;
  padding: 2rem;
}

.wallet-balance h3 {
  margin: 0 0 1rem 0;
  font-family: 'Lato', sans-serif;
  color: #666;
  font-size: 16px;
}

.balance-amount {
  font-size: 48px;
  font-weight: bold;
  color: #f57224;
  margin-bottom: 1rem;
  font-family: 'League Spartan', sans-serif;
}

.manage-my-profile-section {
  width: 100%;
}
.manage-profile-card {
  margin-bottom: 1rem;
  width: 100%;
}

:deep(.el-empty) {
    margin-top: 1px;
    min-height: 120px !important;
    padding: 8px 0 !important;
    .el-empty__image {
      height: 40px !important;
      min-height: 40px !important;
      max-height: 40px !important;
    }
    .el-empty__description {
      margin-top: 4px !important;
      font-size: 13px;
    }
}

/* Responsive design */
@media (max-width: 1200px) {
  .profile-container {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
  
  .el-row {
    flex-direction: column;
  }
  
  .el-col-6 {
    width: 100% !important;
    margin-bottom: 1rem;
  }
  
  .el-col-18 {
    width: 100% !important;
  }
  
  .content-header {
    padding: 1rem;
  }
  
  .content-body {
    padding: 1rem;
  }
  
  .sidebar-header {
    padding: 1rem;
  }
  
  .sidebar-header h3 {
    font-size: 16px;
  }
  
  .content-header h2 {
    font-size: 20px;
  }
  
  .balance-amount {
    font-size: 36px;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 0.5rem;
  }
  
  .content-header {
    padding: 0.75rem;
  }
  
  .content-body {
    padding: 0.75rem;
  }
  
  .sidebar-header {
    padding: 0.75rem;
  }
  
  .card-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .el-form-item {
    margin-bottom: 1rem;
  }
  
  .el-col-12 {
    width: 100% !important;
  }
}

@media (max-width: 1200px) {
  .manage-profile-card {
    margin-bottom: 1rem;
  }
}

/* Saved Addresses Styles */
.saved-addresses-card {
  margin-bottom: 20px;
  border-radius: 12px;
}

.saved-addresses-list {
  max-height: 400px;
  overflow-y: auto;
}

.saved-address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.saved-address-item:hover {
  background-color: #f8f9fa;
}

.saved-address-item:last-child {
  border-bottom: none;
}

.address-info {
  flex: 1;
  min-width: 0;
}

.address-text {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  word-break: break-word;
}

.address-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
}

.address-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
@media (max-width: 768px) {
  .manage-my-profile-section .el-row {
    flex-direction: column;
  }
  .manage-profile-card {
    margin-bottom: 1rem;
  }
}

.orders-section {
  height: 100%;
}

.orders-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.orders-content {
  flex: 1;
  overflow-y: auto;
  max-height: 500px; /* Adjust this height as needed */
  padding-right: 8px; /* Space for scrollbar */
}

.orders-list {
  padding: 16px 0;
}

.order-item {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 8px;
  border-left: 3px solid #409eff;
}

.order-item h4 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
}

.order-item p {
  margin: 4px 0;
  color: #606266;
  font-size: 14px;
}

.order-items-list {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.order-items-list li {
  margin: 4px 0;
  color: #909399;
  font-size: 13px;
}

/* Custom scrollbar styling */
.orders-content::-webkit-scrollbar {
  width: 6px;
}

.orders-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.orders-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.orders-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* For Firefox */
.orders-content {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .orders-content {
    max-height: 400px;
  }
  
  .order-item {
    padding: 12px;
  }
}

@media (max-height: 600px) {
  .orders-content {
    max-height: 300px;
  }
}
</style>