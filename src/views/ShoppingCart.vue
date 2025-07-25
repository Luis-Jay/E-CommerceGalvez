<template>
    <div class="checkout-container">
      <AppHeader />
      
      <!-- Main Content -->
      <el-container class="main-content">
        <!-- Left Column - Order Details -->
        <el-main class="order-section">
          <h2>Order</h2>
          
          <!-- Order Items -->
          <div class="order-items">
            <el-card v-for="item in authStore.currentUser?.cartItems" :key="item.id" class="order-item">
              <div class="item-content">
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

        </el-main>
  
        <!-- Right Column - Payment Summary -->
        <el-aside class="payment-summary">
          <h2>Payment Summary</h2>
          <el-card>
            <div class="account-info">
              <h3>UNREGISTERED ACCOUNT</h3>
              <div class="transaction-info">
                <span>Transaction code</span>
                <span>VC115665</span>
              </div>
            </div>
  
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
  
            <div class="order-summary">
              <div class="summary-row">
                <span>Subtotal ({{ cartStore.totalItems }} items)</span>
                <span>{{ formatPrice(cartStore.subtotal) }}</span>
              </div>
              <div class="summary-row">
                <span>Delivery</span>
                <span>{{ formatPrice(cartStore.deliveryPrice) }}</span>
              </div>
              <div class="summary-row">
                <span>Additional Services</span>
                <span class="blue-text">{{ formatPrice(cartStore.servicesTotal) }}</span>
              </div>
              <div v-if="couponDiscount > 0" class="summary-row discount">
                <span>Discount ({{ (couponDiscount * 100) }}%)</span>
                <span class="discount-amount">-{{ formatPrice(cartStore.subtotal * couponDiscount) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total Amount</span>
                <span>{{ formatPrice(cartStore.finalTotal(couponDiscount)) }}</span>
              </div>
            </div>
  
            <div class="sale-timer">
              <p>SALE EXPIRING IN: {{ timeLeft }}</p>
            </div>
  
            <div class="additional-services">
              <h3>Additional Services</h3>
              <div class="service-item">
                <div class="service-info">
                  <h4>Care+ Package</h4>
                  <p>One year of additional care</p>
                </div>
                <div class="service-price">
                  <span>{{ formatPrice(500) }}</span>
                  <el-switch 
                    v-model="cartStore.services.carePackage" 
                  />
                </div>
              </div>
              <div class="service-item">
                <div class="service-info">
                  <h4>Environment Friendly</h4>
                  <p>Add some tip for earth care</p>
                </div>
                <div class="service-price">
                  <span>{{ formatPrice(100) }}</span>
                  <el-switch 
                    v-model="cartStore.services.environmentFriendly" 
                  />
                </div>
              </div>
              <div class="service-item">
                <div class="service-info">
                  <h4>Golden Guard</h4>
                  <p>30 days more for return</p>
                </div>
                <div class="service-price">
                  <span>{{ formatPrice(250) }}</span>
                  <el-switch 
                    v-model="cartStore.services.goldenGuard" 
                  />
                </div>
              </div>
            </div>
  
            <el-button 
              type="primary" 
              size="large" 
              class="checkout-button"
              @click="proceedToCheckout"
              :disabled="cartStore.items.length === 0"
            >
              Proceed to Checkout - 
              {{ cartStore.items.length === 0 
                ? 'No orders' 
                : formatPrice(cartStore.finalTotal(couponDiscount)) 
              }}
            </el-button>

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
const showCheckout = ref(false)
// Store
const cartStore = useCartStore()
const authStore = useAuthStore()
const orderStore = useOrderStore()


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
console.log('my cart:', cartStore.items)
console.log('cart items:', cartStore.items)
// Sale timer
const saleEndTime = ref(new Date().getTime() + (21 * 60 * 60 * 1000) + (31 * 60 * 1000)) // 21 hours 31 minutes
const timeLeft = ref('')

// Methods
const formatPrice = (price: number): string => {
  return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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

const proceedToCheckout = () => {

  
  showCheckout.value = true

    // Create a recent order entry
  const orderId = 'ORD-' + Math.floor(Math.random() * 1000000).toString()
  const orderDate = new Date().toLocaleDateString()
  const totalAmount = cartStore.finalTotal(couponDiscount.value)


  console.log('showCheckout:', showCheckout.value)
  
  // Here you would typically send the order to your backend
  console.log('Order Details:', {
    items: cartStore.items,
    delivery: cartStore.selectedDelivery,
    services: cartStore.services,
    customer: paymentForm.value,
    total: cartStore.finalTotal(couponDiscount.value),
    coupon: couponCode.value,
    discount: couponDiscount.value
  })
}

const handlePaymentSuccess = () => {
  showCheckout.value = false
  ElMessage.success('Order placed!')
  // Optionally reload orders or trigger animations
}

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

</style>