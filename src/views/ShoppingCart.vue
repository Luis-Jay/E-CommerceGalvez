<template>
    <div class="checkout-container">
      <AppHeader />

      <!-- Main Content -->
      <el-container class="main-content">
        <!-- Left Column - Order Details -->
        <el-main class="order-section">
          <h2>Order</h2>
          <el-checkbox v-model="selectAll" @change="toggleSelectAll">
            Select All ({{ selectedItems.length }}/{{ authStore.currentUser?.cartItems?.length || 0 }})
          </el-checkbox>

          <!-- Order Items -->
          <div class="order-items">
            <el-card v-for="item in authStore.currentUser?.cartItems" :key="item.id" class="order-item">
              <div class="item-content">
                <!-- Item Select Checkbox -->
                <el-checkbox
                  v-model="selectedIds"
                  :label="item.id"
                  class="item-checkbox"
                  @change="onItemSelectionChange"
                />
                <div class="item-image">
                  <div class="placeholder-image">
                      <img :src="item.image" alt="Product Image" class="product-image">
                  </div>
                  <el-tag v-if="item.onSale" type="danger" class="sale-tag">SALE</el-tag>
                </div>

                <div class="item-details">
                  <h3>{{ item.name }}</h3>
                  <p>Color: {{ item.color }}</p>
                  <p>Size: {{ item.size }}</p>
                </div>

                <div class="item-controls">
                  <div class="price-info">
                    <span class="current-price">{{ formatPrice(item.currentPrice) }}</span>
                    <span v-if="item.originalPrice" class="original-price">{{ formatPrice(item.originalPrice) }}</span>
                  </div>

                  <div class="quantity-controls">
                    <span>Quantity:</span>
                    <el-input-number
                      v-model="item.quantity"
                      :min="1"
                      size="small"
                      @change="cartStore.updateItemQuantity(item.id, item.quantity)"
                    />
                  </div>

                  <div class="item-total">
                    <span class="total-label">Total:</span>
                    <span class="total-price">{{ formatPrice(item.currentPrice * item.quantity) }}</span>
                  </div>

                  <el-button
                    type="danger"
                    size="small"
                    @click="authStore.removeItemFromUserCart(item.id)"
                  >
                    Remove
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>

          <!-- Selection Summary -->
          <div v-if="(authStore.currentUser?.cartItems?.length ?? 0) > 0" class="selection-summary">
            <el-alert
              :title="`${selectedItems.length} of ${authStore.currentUser?.cartItems?.length} items selected for checkout`"
              type="info"
              :closable="false"
              show-icon
            />
          </div>

          <!-- Delivery Options -->
          <div class="delivery-section">
            <h2>Delivery</h2>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-card
                  class="delivery-option"
                  :class="{ selected: cartStore.selectedDelivery === 'DPD' }"
                  @click="cartStore.setDelivery('DPD')"
                >
                  <div class="delivery-content">
                    <div class="delivery-icon">DPD</div>
                    <div class="delivery-info">
                      <h4>DPD Deliveries</h4>
                      <p>Expected delivery:</p>
                      <p>Friday, 28</p>
                    </div>
                    <div class="delivery-price">{{ formatPrice(312) }}</div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card
                  class="delivery-option"
                  :class="{ selected: cartStore.selectedDelivery === 'FedEx' }"
                  @click="cartStore.setDelivery('FedEx')"
                >
                  <div class="delivery-content">
                    <div class="delivery-icon">FedEx</div>
                    <div class="delivery-info">
                      <h4>FedEx Fast Delivery</h4>
                      <p>Expected delivery:</p>
                      <p>Friday, 28</p>
                    </div>
                    <div class="delivery-price">{{ formatPrice(362) }}</div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="delivery-row">
              <el-col :span="12">
                <el-card
                  class="delivery-option"
                  :class="{ selected: cartStore.selectedDelivery === 'UPS' }"
                  @click="cartStore.setDelivery('UPS')"
                >
                  <div class="delivery-content">
                    <div class="delivery-icon">UPS</div>
                    <div class="delivery-info">
                      <h4>UPS Deliveries</h4>
                      <p>Expected delivery:</p>
                      <p>Friday, 28</p>
                    </div>
                    <div class="delivery-price">{{ formatPrice(275) }}</div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card
                  class="delivery-option"
                  :class="{ selected: cartStore.selectedDelivery === 'Collect' }"
                  @click="cartStore.setDelivery('Collect')"
                >
                  <div class="delivery-content">
                    <div class="delivery-icon">Collect</div>
                    <div class="delivery-info">
                      <h4>Collect in person</h4>
                      <p>Expected collection:</p>
                      <p>Thursday, 27</p>
                    </div>
                    <div class="delivery-price">Free</div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <h3 class="newsletter-title">Stay Updated</h3>
          <el-form label-position="top" class="newsletter-form">
            <el-form-item label="Subscribe to our newsletter">
              <el-input
                placeholder="Enter your email (optional)"
                class="newsletter-input"
              />
            </el-form-item>
          </el-form>

          <!-- Payment method -->
          <el-card>
            <template #header>
              <div class="card-header">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333;">Payment Method</h3>
              </div>
            </template>

            <div class="payment-methods">
              <div class="payment-grid">
                <!-- Cashless Payment Card -->
                <div class="payment-card" :class="{ active: selectedPayment === 'cashless' }" @click="selectedPayment = 'cashless'">
                  <div class="payment-header">
                    <div class="payment-logos">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/GCash_logo.svg/2560px-GCash_logo.svg.png"
                          alt="GCash" class="payment-logo">
                      <img src="https://faq.goodwork.ph/wp-content/uploads/2020/08/paymaya.png?w=1024"
                          alt="PayMaya" class="payment-logo">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png"
                          alt="Visa" class="payment-logo">
                    </div>
                    <div class="check-icon" v-if="selectedPayment === 'cashless'">
                      <el-icon><Check /></el-icon>
                    </div>
                  </div>
                  <h4 class="payment-title">Cashless Payment</h4>
                  <p class="payment-description">Pay using GCash, PayMaya, or Credit/Debit Card for quick and secure transactions.</p>
                </div>

                <!-- Cash on Delivery Card -->
                <div class="payment-card" :class="{ active: selectedPayment === 'cod' }" @click="selectedPayment = 'cod'">
                  <div class="payment-header">
                    <div class="cod-icon">
                      <el-icon style="font-size: 32px; color: #52c41a;"><Money /></el-icon>
                    </div>
                    <div class="check-icon" v-if="selectedPayment === 'cod'">
                      <el-icon><Check /></el-icon>
                    </div>
                  </div>
                  <h4 class="payment-title">Cash on Delivery</h4>
                  <p class="payment-description">Pay with cash when your order is delivered to your door.</p>
                </div>
              </div>
            </div>
          </el-card>
        </el-main>

        <!-- Right Column - Payment Summary -->
        <el-aside class="payment-summary">
          <h2>Payment Summary</h2>
          <el-card>
            <!-- Account Info -->
            <div class="account-info">
              <h3>UNREGISTERED ACCOUNT</h3>
              <div class="transaction-info">
                <span>Transaction code</span>
                <span>VC115665</span>
              </div>
            </div>

            <!-- Coupon Input -->
            <div class="coupon-section">
              <el-input
                v-model="couponCode"
                placeholder="COUPON CODE"
                class="coupon-input"
                @keyup.enter="applyCoupon"
              >
                <template #append>
                  <el-button type="primary" @click="applyCoupon">Apply</el-button>
                </template>
              </el-input>

              <div v-if="couponDiscount > 0" class="coupon-success">
                <el-alert
                  :title="`Coupon applied! ${(couponDiscount * 100)}% discount`"
                  type="success"
                  :closable="false"
                  show-icon
                />
              </div>
            </div>

            <!-- Order Summary -->
            <div class="order-summary">
              <div class="summary-row">
                <span>Subtotal ({{ selectedItems.length }} selected items)</span>
                <span>{{ formatPrice(selectedSubtotal) }}</span>
              </div>
              <div class="summary-row">
                <span>Delivery</span>
                <span>{{ formatPrice(getDeliveryPrice()) }}</span>
              </div>
              <div class="summary-row">
                <span>Additional Services</span>
                <span class="blue-text">{{ formatPrice(cartStore.servicesTotal) }}</span>
              </div>
              <div
                v-if="couponDiscount > 0"
                class="summary-row discount"
              >
                <span>Discount ({{ (couponDiscount * 100).toFixed(0) }}%)</span>
                <span class="discount-amount">-{{ formatPrice(selectedSubtotal * couponDiscount) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total Amount</span>
                <span>{{ formatPrice(selectedFinalTotal) }}</span>
              </div>
            </div>

            <!-- Sale Timer -->
            <div class="sale-timer">
              <p>SALE EXPIRING IN: {{ timeLeft }}</p>
            </div>

            <!-- Additional Services -->
            <div class="additional-services">
              <h3>Additional Services</h3>
              <div class="service-item">
                <div class="service-info">
                  <h4>Care+ Package</h4>
                  <p>One year of additional care</p>
                </div>
                <div class="service-price">
                  <span>{{ formatPrice(500) }}</span>
                  <el-switch v-model="cartStore.services.carePackage" />
                </div>
              </div>
              <div class="service-item">
                <div class="service-info">
                  <h4>Environment Friendly</h4>
                  <p>Add some tip for earth care</p>
                </div>
                <div class="service-price">
                  <span>{{ formatPrice(100) }}</span>
                  <el-switch v-model="cartStore.services.environmentFriendly" />
                </div>
              </div>
              <div class="service-item">
                <div class="service-info">
                  <h4>Golden Guard</h4>
                  <p>30 days more for return</p>
                </div>
                <div class="service-price">
                  <span>{{ formatPrice(250) }}</span>
                  <el-switch v-model="cartStore.services.goldenGuard" />
                </div>
              </div>
            </div>

            <!-- Checkout Button -->
            <el-button
              type="primary"
              size="large"
              class="checkout-button"
              @click="handleCheckout"
              :disabled="selectedItems.length === 0"
            >
              Proceed to Checkout -
              {{ selectedItems.length === 0
                ? 'Select items'
                : formatPrice(selectedFinalTotal)
              }}
            </el-button>

            <!-- Checkout Dialog -->
            <CheckoutDialog
              :visible="showCheckout"
              @close="showCheckout = false"
              @paymentSuccess="handlePaymentSuccess"
            />
          </el-card>
        </el-aside>
      </el-container>

      <div class="for-you">
        <ForYou />
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { ElMessage } from 'element-plus'
import AppHeader from '../components/AppHeader.vue'
import ForYou from '../components/ForYou.vue'
import { useAuthStore } from '@/stores/authStore'
import CheckoutDialog from '@/components/Checkout.vue'
import { useOrderStore } from '@/stores/orderStore'
import { Check, Money } from '@element-plus/icons-vue'
import { showMessageOnce } from '@/utils/showMessageOnce'
import type { FormInstance } from 'element-plus'
import { ElLoading } from 'element-plus'
import router from '@/router'
import { watch as vueWatch } from 'vue'

const showCheckout = ref(false)

// Store
const cartStore = useCartStore()
const authStore = useAuthStore()
const orderStore = useOrderStore()

// Selection logic
const selectedIds = ref<number[]>([])
const selectAll = ref(false)

// Reactive data
const couponCode = ref('')
const couponDiscount = ref(0)
const paymentForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: ''
})

// Define the payment method type
type PaymentMethod = 'cashless' | 'cod' | ''
const selectedPayment = ref<PaymentMethod>('')

// Sale timer
const saleEndTime = ref(new Date().getTime() + (21 * 60 * 60 * 1000) + (31 * 60 * 1000))
const timeLeft = ref('')

// Computed properties for selected items
const selectedItems = computed(() =>
  authStore.currentUser?.cartItems?.filter(item => selectedIds.value.includes(item.id)) || []
)

const selectedSubtotal = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0)
)

const selectedFinalTotal = computed(() => {
  const subtotal = selectedSubtotal.value
  const discountAmount = subtotal * couponDiscount.value
  const finalSubtotal = subtotal - discountAmount
  return finalSubtotal + getDeliveryPrice() + cartStore.servicesTotal
})

// Methods
const formatPrice = (price: number): string => {
  return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const getDeliveryPrice = (): number => {
  // Only charge delivery if items are selected
  return selectedItems.value.length > 0 ? cartStore.deliveryPrice : 0
}

const applyCoupon = () => {
  const validCoupons: Record<string, number> = {
    'SAVE10': 0.10,
    'WELCOME': 0.15,
    'STUDENT': 0.20,
    'FIRST': 0.25
  }

  const code = couponCode.value.toUpperCase()

  if (validCoupons[code]) {
    couponDiscount.value = validCoupons[code]
    ElMessage.success(`Coupon applied! ${(validCoupons[code] * 100)}% discount`)
  } else {
    couponDiscount.value = 0
    ElMessage.error('Invalid coupon code')
  }
}

// Selection methods
function toggleSelectAll(val: boolean) {
  if (val) {
    selectedIds.value = authStore.currentUser?.cartItems?.map(item => item.id) || []
  } else {
    selectedIds.value = []
  }
}

function onItemSelectionChange() {
  // This function will be called whenever an individual item is selected/deselected
  // The watch effect will handle updating the selectAll checkbox state
}

// Timer update function
const updateTimer = () => {
  const now = new Date().getTime()
  const distance = saleEndTime.value - now

  if (distance > 0) {
    const hours = Math.floor(distance / (1000 * 60 * 60))
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    timeLeft.value = `${hours} HOURS, ${minutes} MINUTES, ${seconds} SECONDS`
  } else {
    timeLeft.value = 'SALE ENDED'
  }
}

// Checkout handling
const handleCheckout = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.error('Please select at least one item to checkout.')
    return
  }

  if (!selectedPayment.value) {
    showMessageOnce('Please select a payment method', 'error')
    return
  }

  if (selectedPayment.value === 'cod') {
    await handleCashOnDelivery()
    return
  }

  showCheckout.value = true

  // Create a recent order entry
  const orderId = 'ORD-' + Math.floor(Math.random() * 1000000).toString()
  const orderDate = new Date().toLocaleDateString()
  const totalAmount = selectedFinalTotal.value

  console.log('Order Details:', {
    items: selectedItems.value,
    delivery: cartStore.selectedDelivery,
    services: cartStore.services,
    customer: paymentForm.value,
    total: totalAmount,
    coupon: couponCode.value,
    discount: couponDiscount.value
  })
}

const handlePaymentSuccess = () => {
  showCheckout.value = false
  ElMessage.success('Order placed!')
  // Remove selected items from cart
  selectedIds.value.forEach(id => {
    authStore.removeItemFromUserCart(id)
  })
  // Clear selection
  selectedIds.value = []
}

// Cash on Delivery handling
const handleCashOnDelivery = async () => {
  const isLoading = ref(false)
  const isProcessing = ref(false)

  isLoading.value = true
  isProcessing.value = true

  const loadingInstance = ElLoading.service({
    text: 'Processing Cash on Delivery order...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000).toString()
    const orderDate = new Date().toISOString().split('T')[0]
    const totalAmount = selectedFinalTotal.value
    const itemsCopy = [...selectedItems.value]

    // Add to user's orders with 'Pending' status for COD
    authStore.addUserOrder({
      orderId,
      date: orderDate,
      status: 'Pending',
      total: totalAmount,
      items: itemsCopy,
    })

    // Remove selected items from cart
    selectedIds.value.forEach(id => {
      authStore.removeItemFromUserCart(id)
    })

    ElMessage({
      message: 'Order placed successfully! Payment will be collected on delivery.',
      type: 'success',
      duration: 3000,
    })

    couponCode.value = ''
    couponDiscount.value = 0
    selectedIds.value = []

    router.push('/shopping-cart')
  } catch (error) {
    console.error('Order placement failed:', error)
    ElMessage.error('Failed to place order. Please try again.')
  } finally {
    isLoading.value = false
    isProcessing.value = false
    loadingInstance.close()
  }
}

// Watchers
const watch = vueWatch

// Update selectAll when selectedIds changes
watch(
  () => selectedIds.value,
  (val) => {
    const allIds = authStore.currentUser?.cartItems?.map(item => item.id) || []
    selectAll.value = val.length === allIds.length && allIds.length > 0
  }
)

// Update selectedIds if cart changes (e.g., item removed)
watch(
  () => authStore.currentUser?.cartItems,
  (items) => {
    const allIds = items?.map(item => item.id) || []
    selectedIds.value = selectedIds.value.filter(id => allIds.includes(id))
  }
)

// Initialize timer
onMounted(() => {
  updateTimer()
  const timer = setInterval(updateTimer, 1000)
  onUnmounted(() => clearInterval(timer))
})
</script>

<style scoped>
* {
    font-family: 'Lato', sans-serif;
}

.for-you {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
}

.checkout-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 0 20px;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-weight: bold;
  font-size: 18px;
}

.nav-menu {
  border-bottom: none;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cart-info {
  display: flex;
  flex-direction: column;
  font-size: 12px;
}

.cart-count {
  color: #666;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
}

.order-section {
  flex: 1;
  padding-right: 20px;
  padding-top: 0;
}

.order-items {
  margin-bottom: 30px;
}

.order-item {
  margin-bottom: 15px;
  position: relative;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.checkout-button {
  width: 100%;
  margin-top: 20px;
  background-color: #f57224;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.item-image {
  position: relative;
}

.placeholder-image {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.sale-tag {
  position: absolute;
  top: -5px;
  right: -5px;
  transform: rotate(45deg);
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}

.item-details p {
  margin: 2px 0;
  color: #666;
  font-size: 14px;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.price-info {
  display: flex;
  gap: 10px;
}

.current-price {
  color: #e74c3c;
  font-weight: bold;
}

.original-price {
  color: #999;
  text-decoration: line-through;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.delivery-section {
  margin-bottom: 30px;
}

.delivery-row {
  margin-top: 15px;
}

.delivery-option {
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s;
}
.delivery-option.selected {
  border: 2px solid #f57224;
  box-shadow: 0 0 8px #409eff33;
}

.delivery-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.delivery-icon {
  width: 40px;
  height: 40px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.delivery-info {
  flex: 1;
}

.delivery-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.delivery-info p {
  margin: 2px 0;
  font-size: 12px;
  color: #666;
}

.delivery-price {
  font-weight: bold;
  color: #409eff;
}

.payment-summary {
  width: 350px;
}

.account-info {
  margin-bottom: 20px;
}

.transaction-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-top: 10px;
}

.coupon-section {
  margin-bottom: 20px;
}

.order-summary {
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.summary-row.total {
  font-weight: bold;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.blue-text {
  color: #409eff;
}

.sale-timer {
  background: #fff5f5;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 20px;
  font-size: 12px;
  color: #e74c3c;
}

.additional-services {
  margin-top: 20px;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.service-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.service-info p {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.service-price {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
}

.newsletter-title {
  margin-top: 30px;
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
}

.newsletter-form {
  margin-top: 10px;
  padding: 16px;
  border: 1px dashed #dcdfe6;
  background-color: #fafafa;
  border-radius: 8px;
}

.newsletter-input .el-input__inner {
  background-color: #fffefc;
  border: 1px solid #dcdfe6;
  transition: border-color 0.2s ease;
}

.newsletter-input .el-input__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 4px rgba(64, 158, 255, 0.2);
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  size: small;
}

.payment-card {
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  position: relative;
  min-height: 160px;
}

.payment-card:hover {
  border-color: #d0d0d0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.payment-card.active {
  border-color: #52c41a;
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.2);
}

.payment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  position: relative;
}

.payment-logos {
  display: flex;
  gap: 8px;
  align-items: center;
}

.payment-logo {
  height: 20px;
  object-fit: contain;
}

.cod-icon {
  display: flex;
  align-items: center;
}

.payment-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.check-icon {
  width: 24px;
  height: 24px;
  background: #52c41a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
}

.payment-description {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 16px 0;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff4d4f;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}

.remove-btn:hover {
  color: #ff7875;
}

@media (max-width: 768px) {
  .payment-grid {
    grid-template-columns: 1fr;
  }
}

</style>
