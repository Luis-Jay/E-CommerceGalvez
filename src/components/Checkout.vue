<template>
    <el-dialog
      :model-value="visible"
      title=""
      width="640px"
      @close="onClose"
      :close-on-click-modal="false"
      class="checkout-dialog"
      top="5vh"
    >
      <div class="checkout-container">
        <!-- Payment Method Selection -->
        <div class="payment-method-section">
          <div class="payment-tabs">
            <div 
              :class="['payment-tab', { active: paymentType === 'card' }]"
              @click="paymentType = 'card'"
            >
              Pay by Card
            </div>
            <div 
              :class="['payment-tab', { active: paymentType === 'digital' }]"
              @click="paymentType = 'digital'"
            >
              Pay with Digital Wallet
            </div>
          </div>
  
          <!-- Payment Options -->
          <div class="payment-options" v-if="paymentType === 'card'">
            <div 
              :class="['payment-option', { selected: form.payment === 'card' }]"
              @click="form.payment = 'card'"
            >
              <i class="el-icon-credit-card"></i>
              <span>Card</span>
            </div>
          </div>
  
          <div class="payment-options" v-else>
            <div 
              :class="['payment-option', { selected: form.payment === 'gcash' }]"
              @click="form.payment = 'gcash'"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/GCash_logo.svg/2560px-GCash_logo.svg.png" 
                alt="GCash"
                class="payment-logo"
              />
            </div>
            <div 
              :class="['payment-option', { selected: form.payment === 'paymaya' }]"
              @click="form.payment = 'paymaya'"
            >
              <img 
                src="https://faq.goodwork.ph/wp-content/uploads/2020/08/paymaya.png?w=1024" 
                alt="PayMaya"
                class="payment-logo"
              />
            </div>
            <div 
              :class="['payment-option', { selected: form.payment === 'alipay' }]"
              @click="form.payment = 'alipay'"
            >
              <span class="alipay-icon">支</span>
              <span>Alipay</span>
            </div>
          </div>
        </div>
  
        <!-- Security Notice -->
        <div class="security-notice">
          <i class="el-icon-lock"></i>
          <span>Secure payment link</span>
          <i class="el-icon-arrow-down"></i>
          <span class="learn-more">Learn more</span>
        </div>
  
        <!-- Payment Form -->
        <el-form 
          :model="form" 
          :rules="rules" 
          ref="formRef" 
          class="checkout-form"
          label-position="top"
        >
          <!-- Email -->
           
          <div class="form-group">
            <label class="form-label">Email address</label>
            <el-form-item label="" prop="email">
            <el-input 
              v-model="form.email" 
              placeholder="Enter your email"
              class="form-input"
              size="large"
            />
        </el-form-item>
          </div>
  
          <!-- Card Information (only show if card payment selected) -->
          <div v-if="paymentType === 'card' && form.payment === 'card'" class="card-section">
            <div class="form-group">
              <label class="form-label">Card number</label>
              <el-form-item label="" prop="cardNumber">
              <el-input 
                v-model="form.cardNumber" 
                placeholder="1234 1234 1234 1234"
                class="form-input card-input"
                size="large"
                maxlength="19"
                @input="formatCardNumber"
              >
                <template #suffix>
                  <div class="card-brands">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/1200px-Visa_2021.svg.png" alt="Visa" class="card-brand" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png" alt="Mastercard" class="card-brand" />
                  </div>
                </template>
              </el-input>
              </el-form-item>
            </div>
  
            <div class="form-row">
              <div class="form-group half">
                <label class="form-label">Expiration date</label>
                <el-form-item label="" prop="expiryDate">
                    <el-input 
                    v-model="form.expiryDate"   
                    placeholder="MM / YYYY"
                    class="form-input"
                    size="large"
                    maxlength="7"
                    @input="formatExpiryDate"
                    />
                </el-form-item>
              </div>
              <div class="form-group half">
                <label class="form-label">Security code</label>
                <el-form-item label="" prop="cvv">
                <el-input 
                  v-model="form.cvv" 
                  placeholder="123"
                  class="form-input"
                  size="large"
                  maxlength="4"
                  type="password"
                />
               </el-form-item>
              </div>
            </div>
  
            <div class="form-group">
              <label class="form-label">Cardholder name</label>
              <el-form-item label="" prop="cardholderName">
              <el-input 
                v-model="form.cardholderName" 
                placeholder="Full name on card"
                class="form-input"
                size="large"
              />
              </el-form-item>
            </div>
          </div>
  
          <!-- Billing Address -->
          <div class="billing-section">
            <div class="form-group">
              <label class="form-label">Country or region</label>
              <el-select 
                v-model="form.country" 
                placeholder="Select country"
                class="form-input country-select"
                size="large"
              >
                <el-option label="Philippines" value="PH">
                  <span class="country-option">
                    🇵🇭 Philippines
                  </span>
                </el-option>
                <el-option label="China" value="CH">
                  <span class="country-option">
                    🇨🇳 China
                  </span>
                </el-option>
              </el-select>
            </div>
  
            <div class="form-group">
              <label class="form-label">Address</label>
              <el-form-item label="" prop="address">
              <el-input 
                v-model="form.address" 
                placeholder="Street address"
                class="form-input"
                size="large"
              />
              </el-form-item>
              <button type="button" class="clear-btn" @click="clearText()">Clear</button>
            </div>
  
            <div class="form-row">
              <div class="form-group half">
                <label class="form-label">City</label>
                <el-form-item label="" prop="city">
                <el-input 
                  v-model="form.city" 
                  placeholder="City"
                  class="form-input"
                  size="large"
                />
            </el-form-item>
              </div>
              <div class="form-group half">
                <label class="form-label">ZIP code</label>
                <el-form-item label="" prop="zipCode">
                <el-input 
                  v-model="form.zipCode" 
                  placeholder="ZIP code"
                  class="form-input"
                  size="large"
                />
              </el-form-item>
              </div>
            </div>
  
            <div class="form-group">
                <el-form-item label="" prop="phoneNumber">
              <label class="form-label">Enter your number</label>
              <el-input 
                v-model="form.phoneNumber" 
                placeholder="Phone Number"
                class="form-input"
                size="large"
              />
            </el-form-item>
            </div>
          </div>
  
          <!-- Order Summary -->
          <div class="order-summary">
            <div class="summary-row">
              <span class="summary-label">Subtotal</span>
              <span class="summary-value">{{ formatPrice(cartStore.subtotal) }}</span>
            </div>
            <div class="summary-row total">
              <span class="summary-label">Total</span>
              <span class="summary-value">{{ formatPrice(cartStore.finalTotal(couponDiscount)) }}</span>
            </div>
          </div>
  
          <!-- Pay Button -->
            <el-button 
            type="primary"
            :loading="isLoading"
            @click="submitForm"
            class="pay-button"
            :disabled="isSuccess"
            size="large"
            >
            <template #icon>
                <el-icon v-if="!isLoading && !isSuccess"><Lock /></el-icon>
                <el-icon v-else-if="isLoading"><Loading /></el-icon>
                <el-icon v-else-if="isSuccess" color="green"><CircleCheck /></el-icon>
            </template>

            <span v-if="isSuccess">Payment Successful</span>
            <span v-else-if="isLoading" class="processing-text">
                Processing<span class="dots"><span>.</span><span>.</span><span>.</span></span>
            </span>
            <span v-else>Pay ₱{{ formatAmount(form.amount || 0) }}</span>
            </el-button>


  
          <!-- Footer -->
          <div class="payment-footer">
            <span>Powered by Supplier</span>
            <span>•</span>
            <a href="#">Terms</a>
            <span>•</span>
            <a href="#">Privacy</a>
          </div>
        </el-form>
  
        <el-alert 
          v-if="success" 
          title="Payment Successful!" 
          type="success" 
          show-icon 
          class="success-alert"
          description="Your payment has been processed successfully."
        />
      </div>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useCartStore } from '@/stores/cartStore'
  import { useAuthStore } from '@/stores/authStore'
  import { ElMessage, ElLoading } from 'element-plus'
  import { showMessageOnce } from '@/utils/showMessageOnce'
  import router from '@/router'
  import { useOrderStore } from '@/stores/orderStore'
  
  onMounted(() => {
  timer = window.setInterval(updateTimer, 1000)
  orderStore.loadOrders() // 🔥 Load persisted orders
})


  // Stores
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const orderStore = useOrderStore()
  
  // Refs
  const couponCode = ref('')
  const couponDiscount = ref(0)
  const isLoading = ref(false)
  const isProcessing = ref(false)
  const isSuccess = ref(false)
  const formRef = ref<FormInstance>()
  const paymentType = ref<PaymentType>('card')
  const saleEndTime = ref(Date.now() + (21 * 60 * 60 * 1000) + (31 * 60 * 1000)) // 21h 31m
  const timeLeft = ref('')
  let timer: number | undefined
  
  // Types
  interface CheckoutForm {
    email: string
    payment: 'card' | 'gcash' | 'paymaya' | 'alipay'
    cardNumber: string
    expiryDate: string
    cvv: string
    cardholderName: string
    country: string
    address: string
    city: string
    zipCode: string
    phoneNumber: string
    amount: number
  }
  
  type PaymentType = 'card' | 'digital'
  
  // Form data
  const form = reactive<CheckoutForm>({
    email: '',
    payment: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    country: 'PH',
    address: '',
    city: '',
    zipCode: '',
    phoneNumber: '',
    amount: 609.98
  })
  
  // Props
  interface Props {
    visible: boolean
    loading?: boolean
    success?: boolean
  }
  
  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    success: false
  })
  
  // Emits
  interface Emits {
    (e: 'close'): void
    (e: 'submit', form: CheckoutForm): void
    (e: 'paymentSuccess'): void
  }

  
  
  const emit = defineEmits<Emits>()
  
  // Coupon logic
  const applyCoupon = async () => {
    const validCoupons: Record<string, number> = {
      SAVE10: 0.10,
      WELCOME: 0.15,
      STUDENT: 0.20,
      FIRST: 0.25
    }
  
    const code = couponCode.value.trim().toUpperCase()
    const loadingInstance = ElLoading.service({ text: 'Verifying coupon...' })
  
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      if (validCoupons[code]) {
        couponDiscount.value = validCoupons[code]
        ElMessage.success(`Coupon applied! ${validCoupons[code] * 100}% discount`)
      } else {
        couponDiscount.value = 0
        ElMessage.error('Invalid coupon code')
      }
    } finally {
      loadingInstance.close()
    }
  }
  
  // Timer logic
  const updateTimer = () => {
    const now = Date.now()
    const distance = saleEndTime.value - now
  
    if (distance > 0) {
      const hours = Math.floor(distance / 3600000)
      const minutes = Math.floor((distance % 3600000) / 60000)
      const seconds = Math.floor((distance % 60000) / 1000)
      timeLeft.value = `${hours} HOURS, ${minutes} MINUTES, ${seconds} SECONDS`
    } else {
      timeLeft.value = 'SALE ENDED'
      clearInterval(timer)
    }
  }
  
  onMounted(() => {
    timer = window.setInterval(updateTimer, 1000)
  })
  
  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })
  
  // Validation rules
  const rules: FormRules<CheckoutForm> = {
    payment: [
  {
    required: true,
    trigger: 'change',
    validator: (_rule, value, callback) => {
      if (paymentType.value === 'digital' && !['gcash', 'paymaya', 'alipay'].includes(value)) {
        callback(new Error('Please select a digital wallet (GCash, PayMaya, or Alipay)'))
      } else {
        callback()
      }
    }
  }
],

    email: [
      { required: true, message: 'Email is required', trigger: 'blur' },
      { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
    ],
    cardNumber: [
      { 
        required: true, 
        message: 'Card number is required', 
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (paymentType.value !== 'card') return callback()
          if (!value || value.replace(/\s/g, '').length !== 16) {
            callback(new Error('Please enter a valid 16-digit card number'))
          } else {
            callback()
          }
        }
      }
    ],
    expiryDate: [
      { 
        required: true, 
        message: 'Expiry date is required', 
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (paymentType.value !== 'card') return callback()
          const regex = /^(0[1-9]|1[0-2])\/[0-9]{2}$/
          if (!regex.test(value)) {
            callback(new Error('Please enter a valid expiry date (MM/YY)'))
          } else {
            callback()
          }
        }
      }
    ],
    cvv: [
      { 
        required: true, 
        message: 'Security code is required', 
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (paymentType.value !== 'card') return callback()
          if (!value || !/^\d{3,4}$/.test(value)) {
            callback(new Error('Please enter a valid 3-4 digit CVV'))
          } else {
            callback()
          }
        }
      }
    ],
    cardholderName: [
      { 
        required: true, 
        message: 'Cardholder name is required', 
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (paymentType.value !== 'card') return callback()
          if (!value || value.length < 2) {
            callback(new Error('Please enter a valid cardholder name'))
          } else {
            callback()
          }
        }
      }
    ],
    country: [
      { required: true, message: 'Country is required', trigger: 'change' }
    ],
    address: [
      { required: true, message: 'Address is required', trigger: 'blur' }
    ],
    city: [
      { required: true, message: 'City is required', trigger: 'blur' }
    ],
    zipCode: [
      { required: true, message: 'ZIP code is required', trigger: 'blur' }
    ],
    phoneNumber: [
      { 
        required: true, 
        message: 'Phone number is required', 
        trigger: 'blur',
        validator: (rule, value, callback) => {
          if (!value || !/^(09\d{9}|\+639\d{9})$/.test(value.replace(/\s+/g, ''))) {
            callback(new Error('Please enter a valid phone number'))
          } else {
            callback()
          }
        }
      }
    ]
  }
  
  // Formatters
  const formatPrice = (price: number): string =>
    `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`
  
  const formatCardNumber = (value: string): void => {
    if (paymentType.value !== 'card') return
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const match = v.slice(0, 16)
    const parts: string[] = []
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    form.cardNumber = parts.join(' ')
  }
  
  const formatExpiryDate = (value: string): void => {
    if (paymentType.value !== 'card') return
    const v = value.replace(/\D/g, '')
    form.expiryDate = v.length >= 2 ? `${v.slice(0, 2)}/${v.slice(2, 4)}` : v
  }
  
  const formatAmount = (amount: number): string => amount.toFixed(2)
  
  const handlePaymentTypeChange = async (type: PaymentType): Promise<void> => {
    const loadingInstance = ElLoading.service({ text: 'Switching payment method...' })
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate transition
      paymentType.value = type
      form.payment = type === 'card' ? 'card' : 'gcash'
      
      // Clear card-specific fields when switching to digital
      if (type === 'digital') {
        form.cardNumber = ''
        form.expiryDate = ''
        form.cvv = ''
        form.cardholderName = ''
      }
      
      ElMessage.success(`Switched to ${type === 'card' ? 'Card' : 'Digital'} payment`)
    } finally {
      loadingInstance.close()
      router.push('/')
    }
  }
  
  const clearText = () => {
    form.address = ''
  }
  
  const submitForm = async (): Promise<void> => {
  if (!formRef.value) return

  isLoading.value = true
  isSuccess.value = false
  isProcessing.value = true

  const loadingInstance = ElLoading.service({
    text: 'Processing payment...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    await formRef.value.validate()

    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate payment delay

    const totalAmount = cartStore.totalPrice
    const itemsCopy = [...cartStore.items]


    // ✅ Add to current user's orders in localStorage
    authStore.addUserOrder({
      orderId: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      total: totalAmount,
      items: itemsCopy
    })

    // Clear the cart
    cartStore.clearCart()

    ElMessage({
      message: '✅ Payment successful!',
      type: 'success',
      duration: 3000
    })

    emit('paymentSuccess')

    formRef.value.resetFields()
    couponCode.value = ''
    couponDiscount.value = 0
    isSuccess.value = true

    router.push('/shopping-cart')

  } catch (error) {
    console.error('Payment failed:', error)
    ElMessage.error('❌ Payment failed. Please check your details.')
  } finally {
    isLoading.value = false
    isProcessing.value = false
    loadingInstance.close()
    setTimeout(() => {
      window.location.reload();
    },500)
  }
}


  
  const onClose = (): void => {
    emit('close')
  }

  

  </script>
  
  

<style scoped>
.checkout-dialog {
  --primary-blue: #4285f4;
  --border-color: #e1e8ed;
  --text-primary: #1c1e21;
  --text-secondary: #65676b;
  --bg-light: #f8f9fa;
  --hover-bg: #f2f3f5;
}

.checkout-dialog :deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.checkout-dialog :deep(.el-dialog__header) {
  display: none;
}

.checkout-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.checkout-container {
  background: white;
  max-height: 80vh;
  overflow-y: auto;
}

/* Payment Method Tabs */
.payment-method-section {
  border-bottom: 1px solid var(--border-color);
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.payment-tabs {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.payment-tab {
  flex: 1;
  padding: 16px 24px;
  text-align: center;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.payment-tab.active {
  color: var(--text-primary);
  border-bottom-color: var(--primary-blue);
  background: white;
}

.payment-tab:hover:not(.active) {
  background: var(--hover-bg);
}

/* Payment Options */
.payment-options {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  background: var(--bg-light);
  align-items: center;
  justify-content: center;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1.5px solid var(--border-color);
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  justify-content: center;
}

.payment-option:hover {
  border-color: var(--primary-blue);
}

.payment-option.selected {
  border-color: var(--primary-blue);
  background: #e8f0fe;
}

.payment-option i {
  font-size: 18px;
  color: var(--text-secondary);
}

.payment-logo {
  height: 20px;
  width: auto;
}

.alipay-icon {
  background: #1677ff;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* Security Notice */
.security-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--bg-light);
  border-bottom: 1px solid var(--border-color);
  font-size: 14px;
  color: var(--text-secondary);
}

.security-notice i:first-child {
  color: #28a745;
}

.learn-more {
  margin-left: auto;
  color: var(--primary-blue);
  cursor: pointer;
}

/* Form Styles */
.checkout-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group.half {
  width: calc(50% - 6px);
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 6px;
  
}

.form-input :deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: none;
  transition: all 0.2s;
  padding: 12px;
  color: #65676b;
  border: 1px solid #bdbdbd;
  width: 200px;
  font-size: 20px;
}

.form-input :deep(.el-input__wrapper:hover) {
  border-color: #b0b3b8;
}

.form-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 2px rgba(72, 74, 78, 0.1);
}

.form-input :deep(.el-input__inner) {
  font-size: 15px;
  color: var(--text-primary);
}

/* Card Input Specific */
.card-input :deep(.el-input__suffix) {
  padding-right: 12px;
}

.card-brands {
  display: flex;
  gap: 6px;
}

.card-brand {
  height: 16px;
  opacity: 0.6;
}

/* Country Select */
.country-select :deep(.el-select__wrapper) {
  border-radius: 6px;
  border: 1px solid var(--border-color);
  color: #65676b;
}

.country-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Clear Button */
.clear-btn {
  position: absolute;
  right: 8px;
  top: 32px;
  background: none;
  border: none;
  color: var(--primary-blue);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 8px;
}

/* Order Summary */
.order-summary {
  margin: 24px 0;
  padding: 20px 0;
  border-top: 1px solid var(--border-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 15px;
}

.summary-row.total {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
  margin-bottom: 0;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
}

.summary-label {
  color: var(--text-secondary);
}

.summary-value {
  color: var(--text-primary);
}

/* Pay Button */
.pay-button {
  width: 100%;
  height: 48px;
  border-color: var(--primary-blue);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.pay-button:hover {
  background: #3367d6;
  border-color: #3367d6;
}

.pay-button i {
  margin-right: 8px;
}

/* Footer */
.payment-footer {
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.payment-footer a {
  color: var(--primary-blue);
  text-decoration: none;
}

.payment-footer span {
  margin: 0 8px;
}

/* Success Alert */
.success-alert {
  margin: 16px 24px;
  border-radius: 8px;
}

/* Sections */
.card-section {
  margin: 24px 0;
  padding: 24px;
  background: var(--bg-light);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.billing-section {
  margin: 24px 0;
}


/* Responsive */
@media (max-width: 768px) {
  .checkout-dialog :deep(.el-dialog) {
    width: 95% !important;
    margin: 2vh auto;
  }
  
  .payment-options {
    flex-direction: column;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .form-group.half {
    width: 100%;
  }
}
</style>
