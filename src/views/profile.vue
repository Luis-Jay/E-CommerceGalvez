<template>
    <AppHeader />
    <div class="profile-container">
      <el-row :gutter="24">
        <!-- Sidebar Navigation -->
        <el-col :span="6">
          <div class="profile-sidebar">
            <div class="sidebar-header">
              <h3>Hello, {{ profileForm.firstName }}</h3>
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
              <div v-if="activeMenu === 'manage-my-profile'" class="manage-my-profile-section">
                <el-row :gutter="20">
                  <!-- Personal Profile -->
                  <el-col :span="12">
                    <el-card class="manage-profile-card">
                      <template #header>
                        <div class="card-header">
                          <span>Personal Profile</span>
                          <el-button type="primary" size="small">Edit</el-button>
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
                  </el-col>
                  <!-- Address Book -->
                  <el-col :span="12">
                    <el-card class="manage-profile-card">
                      <template #header>
                        <div class="card-header">
                          <span>Address Book</span>
                          <el-button type="primary" size="small">Edit</el-button>
                        </div>
                      </template>
                      <el-empty class description="No addresses saved yet" />
                    </el-card>
                  </el-col>
                </el-row>
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
                        <el-table-column prop="orderId" label="Order ID" width="120" />
                        <el-table-column prop="date" label="Date" width="140" />
                        <el-table-column prop="status" label="Status" width="120" />
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
                <el-card class="address-card">
                  <template #header>
                    <div class="card-header">
                      <span>My Addresses</span>
                      <el-button type="primary" size="small">Add New Address</el-button>
                    </div>
                  </template>
                  <el-empty description="No addresses saved yet" />
                </el-card>
              </div>
  
              <!-- Payment Options Content -->
              <div v-if="activeMenu === 'payment-options'" class="payment-section">
                <el-card class="payment-card">
                  <template #header>
                    <div class="card-header">
                      <span>Payment Methods</span>
                      <el-button type="primary" size="small">Add Payment Method</el-button>
                    </div>
                  </template>
                  <el-empty description="No payment methods added yet" />
                </el-card>
              </div>
  
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
              <div v-if="!authStore.currentUser || !authStore.currentUser.orders || authStore.currentUser.orders.length === 0">
                <el-empty description="No orders found" />
              </div>
              <div v-else>
                <el-timeline>
                  <el-timeline-item
                    v-for="order in authStore.currentUser.orders"
                    :key="order.orderId"
                    :timestamp="order.date"
                    placement="top"
                  >
                    <h4>Order ID: {{ order.orderId }}</h4>
                    <p>Status: {{ order.status }}</p>
                    <p>Total: ₱{{ order.total.toFixed(2) }}</p>
                    <ul>
                      <li v-for="item in order.items" :key="item.id">
                        {{ item.name }} (x{{ item.quantity }}) - ₱{{ item.currentPrice }}
                      </li>
                    </ul>
                  </el-timeline-item>
                </el-timeline>
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
              <div v-if="activeMenu === 'my-cancellations'" class="cancellations-section">
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
import { ref, computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useOrderStore } from '@/stores/orderStore'
import { useCartStore } from '@/stores/cartStore'
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
const authStore = useAuthStore()

// Reactive data
const activeMenu = ref('my-profile')

// order store
const cart = useCartStore()
const orderStore = useOrderStore()

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

// Computed properties for dynamic content
const currentPageTitle = computed(() => {
  const titles: Record<string, string> = {
    'manage-my-profile': 'Manage My Profile',
    'address-book': 'Address Book',
    'payment-options': 'Payment Options',
    'lazada-wallet': 'Lazada Wallet',
    'my-returns': 'My Returns',
    'my-cancellations': 'My Cancellations',
    
  }
  return titles[activeMenu.value] || 'Manage My Profile'
})

const currentPageDescription = computed(() => {
  const descriptions: Record<string, string> = {
    'address-book': 'Save and manage your delivery addresses',
    'payment-options': 'Add and manage your payment methods',
    'lazada-wallet': 'View your wallet balance and transaction history',
    'my-returns': 'Track your return requests and refund status',
    'my-cancellations': 'View your cancelled orders and refund details',
  }
  return descriptions[activeMenu.value] || 'Manage your personal information'
})

// Masked email computed property
const maskedEmail = computed(() => {
  const email = profileForm.value.email
  const [name, domain] = email.split('@')
  if (!name || !domain) return email
  const maskedName = name[0] + '*'.repeat(Math.max(0, name.length - 2)) + name[name.length - 1]
  return `${maskedName}@${domain}`
})
// Mock recent orders data
const recentOrders = computed(() => currentUser?.orders || [])

// Methods
const handleMenuSelect = (index: string) => {
  activeMenu.value = index
}

const checkout = () => {
  if (cart.items.length === 0) return

  const total = cart.items.reduce((acc, item) => acc + item.currentPrice * item.quantity, 0)
  orderStore.addOrder([...cart.items], total)
  cart.clearCart() // You already added this
}


const route = useRoute()

watch(
  () => route.query.section,
  (section) => {
    if (Array.isArray(section)) {
      if (section.length > 0 && typeof section[0] === 'string' && section[0] !== null) activeMenu.value = section[0]
    } else if (typeof section === 'string' && section !== null) {
      activeMenu.value = section
    }
  },
  { immediate: true }
)

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=League+Spartan:wght@100..900&family=Manufacturing+Consent&display=swap');

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
@media (max-width: 768px) {
  .manage-my-profile-section .el-row {
    flex-direction: column;
  }
  .manage-profile-card {
    margin-bottom: 1rem;
  }
}
</style>