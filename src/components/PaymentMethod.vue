<template>
  <el-dialog
    :model-value="visible"
    title=""
    width="600px"
    @close="onClose"
    :close-on-click-modal="false"
    class="add-payment-dialog"
    top="5vh"
  >
    <div class="add-payment-container">
      <!-- Header -->
      <div class="dialog-header">
        <h2>Add Payment Method</h2>
        <p>Save a payment method for faster checkout</p>
      </div>

      <!-- Payment Method Selection -->
      <div class="payment-method-section">
        <div class="payment-tabs">
          <div 
            :class="['payment-tab', { active: paymentType === 'card' }]"
            @click="paymentType = 'card'"
          >
            Credit/Debit Card
          </div>
          <div 
            :class="['payment-tab', { active: paymentType === 'digital' }]"
            @click="paymentType = 'digital'"
          >
            Digital Wallet
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
            <span class="alipay-icon">D</span>
            <span>DigiShop Wallet</span>
          </div>
        </div>
      </div>

      <!-- Existing Saved Payment Methods -->
      <div v-if="paymentMethodStore.hasPaymentMethods" class="existing-methods">
        <div class="existing-methods-header">
          <h3>Your Saved Payment Methods ({{ paymentMethodStore.savedPaymentMethods.length }})</h3>
        </div>
        <div class="existing-methods-list">
          <div 
            v-for="method in paymentMethodStore.savedPaymentMethods" 
            :key="method.id"
            class="existing-method-item"
          >
            <div class="method-info">
              <div class="method-name">{{ paymentMethodStore.getPaymentMethodDisplayName(method) }}</div>
              <div class="method-details">
                <span v-if="method.number">{{ paymentMethodStore.maskPaymentInfo(method).number }}</span>
                <span v-if="method.accountInfo">{{ paymentMethodStore.maskPaymentInfo(method).accountInfo }}</span>
                <span v-if="method.expiryDate">Expires: {{ method.expiryDate }}</span>
                <span v-if="method.isDefault" class="default-badge">Default</span>
                <span class="method-type-badge" :class="method.type">{{ method.type === 'card' ? 'Card' : 'Digital' }}</span>
              </div>
            </div>
            <div class="method-actions">
              <el-button 
                v-if="!method.isDefault"
                size="small" 
                type="primary"
                plain
                @click="setAsDefault(method.id)"
              >
                Set Default
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="deleteSavedPaymentMethod(method.id)"
              >
                Delete
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Notice -->
      <div class="security-notice">
        <i class="el-icon-lock"></i>
        <span>Your payment information is encrypted and secure</span>
      </div>

      <!-- Payment Form -->
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef" 
        class="payment-form"
        label-position="top"
      >
        <!-- Payment Method Name -->
        <div class="form-group">
          <label class="form-label">Payment Method Name</label>
          <el-form-item label="" prop="name">
            <el-input 
              v-model="form.name" 
              placeholder="e.g., My Credit Card, Work Card"
              class="form-input"
              size="large"
            />
          </el-form-item>
        </div>

        <!-- Card Information (only show if card payment selected) -->
        <div v-if="paymentType === 'card' && form.payment === 'card'" class="card-section">
          <div class="form-group">
            <label class="form-label">Card Number</label>
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
              <label class="form-label">Expiration Date</label>
              <el-form-item label="" prop="expiryDate">
                <el-input 
                  v-model="form.expiryDate"   
                  placeholder="MM/YY"
                  class="form-input"
                  size="large"
                  maxlength="5"
                  @input="formatExpiryDate"
                />
              </el-form-item>
            </div>
            <div class="form-group half">
              <label class="form-label">Security Code</label>
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
            <label class="form-label">Cardholder Name</label>
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

        <!-- Digital Wallet Information -->
        <div v-else-if="paymentType === 'digital'" class="digital-section">
          <div class="form-group">
            <label class="form-label">Account Number/Email</label>
            <el-form-item label="" prop="accountInfo">
              <el-input 
                v-model="form.accountInfo" 
                :placeholder="getDigitalWalletPlaceholder()"
                class="form-input"
                size="large"
              />
            </el-form-item>
          </div>
        </div>

        <!-- Set as Default Option -->
        <div class="default-payment-section">
          <el-checkbox v-model="setAsDefaultMethod" class="default-payment-checkbox">
            Set as default payment method
          </el-checkbox>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <el-button 
            size="large"
            @click="onClose"
            class="cancel-button"
          >
            Cancel
          </el-button>
          <el-button 
            type="primary"
            :loading="isLoading"
            @click="savePaymentMethod"
            class="save-button"
            size="large"
          >
            <template #icon>
              <el-icon v-if="!isLoading"><Plus /></el-icon>
              <el-icon v-else><Loading /></el-icon>
            </template>
            {{ isLoading ? 'Saving...' : 'Save Payment Method' }}
          </el-button>
        </div>
      </el-form>

      <!-- Success Message -->
      <el-alert 
        v-if="showSuccess" 
        title="Payment Method Added!" 
        type="success" 
        show-icon 
        class="success-alert"
        description="Your payment method has been saved successfully."
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { usePaymentMethodStore } from '@/stores/paymentMethodStore'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import { Plus, Loading } from '@element-plus/icons-vue'

// Stores
const paymentMethodStore = usePaymentMethodStore()

// Refs
const isLoading = ref(false)
const showSuccess = ref(false)
const formRef = ref<FormInstance>()
const paymentType = ref<PaymentType>('card')
const setAsDefaultMethod = ref(false)

// Types
interface PaymentForm {
  name: string
  payment: 'card' | 'gcash' | 'paymaya' | 'alipay'
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  accountInfo: string
}

type PaymentType = 'card' | 'digital'

// Form data
const form = reactive<PaymentForm>({
  name: '',
  payment: 'card',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  accountInfo: ''
})

// Props
interface Props {
  visible: boolean
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'close'): void
  (e: 'paymentMethodAdded'): void
}

const emit = defineEmits<Emits>()

// Watch payment type changes and reset form accordingly
watch(paymentType, (newType) => {
  if (newType === 'card') {
    form.payment = 'card'
    form.accountInfo = ''
  } else {
    form.payment = 'gcash'
    form.cardNumber = ''
    form.expiryDate = ''
    form.cvv = ''
    form.cardholderName = ''
  }
})

// Initialize store
onMounted(() => {
  paymentMethodStore.initializeStore()
  // Set as default if no existing payment methods
  setAsDefaultMethod.value = !paymentMethodStore.hasPaymentMethods
})

// Validation rules
const rules: FormRules<PaymentForm> = {
  name: [
    { required: true, message: 'Payment method name is required', trigger: 'blur' },
    { min: 2, message: 'Name must be at least 2 characters', trigger: 'blur' }
  ],
  payment: [
    { required: true, message: 'Please select a payment method', trigger: 'change' }
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
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/
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
  accountInfo: [
    { 
      required: true, 
      message: 'Account information is required', 
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (paymentType.value !== 'digital') return callback()
        if (!value || value.length < 5) {
          callback(new Error('Please enter valid account information'))
        } else {
          callback()
        }
      }
    }
  ]
}

// Methods
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

const getDigitalWalletPlaceholder = (): string => {
  switch (form.payment) {
    case 'gcash':
      return 'Enter your GCash mobile number'
    case 'paymaya':
      return 'Enter your PayMaya email or mobile number'
    case 'alipay':
      return 'Enter your DigiShop Wallet email'
    default:
      return 'Enter account information'
  }
}

const savePaymentMethod = async (): Promise<void> => {
  if (!formRef.value) return

  isLoading.value = true
  showSuccess.value = false

  const loadingInstance = ElLoading.service({
    text: 'Saving payment method...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    await formRef.value.validate()

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const paymentData = {
      type: paymentType.value,
      name: form.name,
      isDefault: setAsDefaultMethod.value,
      ...(paymentType.value === 'card' ? {
        number: form.cardNumber,
        expiryDate: form.expiryDate,
        cvv: form.cvv,
        cardholderName: form.cardholderName
      } : {
        accountInfo: form.accountInfo,
        paymentMethod: form.payment
      })
    }

    // Save using the store
    const savedMethod = paymentMethodStore.savePaymentMethod(paymentData)
    
    ElMessage.success(`Payment method "${savedMethod.name}" saved successfully!`)
    showSuccess.value = true
    
    // Reset form
    formRef.value.resetFields()
    setAsDefaultMethod.value = false
    
    // Reset payment type selection
    paymentType.value = 'card'
    form.payment = 'card'
    
    emit('paymentMethodAdded')
    
    // Auto close after success
    setTimeout(() => {
      onClose()
    }, 1500)

  } catch (error: any) {
    console.error('Failed to save payment method:', error)
    ElMessage.error(error.message || 'Failed to save payment method. Please try again.')
  } finally {
    isLoading.value = false
    loadingInstance.close()
  }
}

const setAsDefault = async (methodId: string): Promise<void> => {
  const loadingInstance = ElLoading.service({
    text: 'Updating default payment method...',
    background: 'rgba(0, 0, 0, 0.5)'
  })

  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    paymentMethodStore.setDefaultPaymentMethod(methodId)
    const method = paymentMethodStore.getPaymentMethodById(methodId)
    ElMessage.success(`"${method?.name}" is now your default payment method!`)
  } catch (error: any) {
    console.error('Error setting default payment method:', error)
    ElMessage.error(error.message || 'Failed to update default payment method')
  } finally {
    loadingInstance.close()
  }
}

const deleteSavedPaymentMethod = async (methodId: string): Promise<void> => {
  const method = paymentMethodStore.getPaymentMethodById(methodId)
  if (!method) return

  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete "${method.name}"? This action cannot be undone.`,
      'Delete Payment Method',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    const loadingInstance = ElLoading.service({
      text: 'Deleting payment method...',
      background: 'rgba(0, 0, 0, 0.5)'
    })

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      paymentMethodStore.deletePaymentMethod(methodId)
      ElMessage.success(`"${method.name}" has been deleted successfully!`)
    } finally {
      loadingInstance.close()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Error deleting payment method:', error)
      ElMessage.error(error.message || 'Failed to delete payment method')
    }
  }
}

const onClose = (): void => {
  showSuccess.value = false
  
  // Reset form when closing
  if (formRef.value) {
    formRef.value.resetFields()
  }
  
  // Reset form data
  Object.assign(form, {
    name: '',
    payment: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    accountInfo: ''
  })
  
  // Reset other states
  paymentType.value = 'card'
  setAsDefaultMethod.value = !paymentMethodStore.hasPaymentMethods
  
  emit('close')
}
</script>

<style scoped>
.add-payment-dialog {
  --primary-blue: #4285f4;
  --border-color: #e1e8ed;
  --text-primary: #1c1e21;
  --text-secondary: #65676b;
  --bg-light: #f8f9fa;
  --hover-bg: #f2f3f5;
  --success-green: #28a745;
}

.add-payment-dialog :deep(.el-dialog) {
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.add-payment-dialog :deep(.el-dialog__header) {
  display: none;
}

.add-payment-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.add-payment-container {
  background: white;
  max-height: 85vh;
  overflow-y: auto;
}

/* Header */
.dialog-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-color);
  text-align: center;
}

.dialog-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.dialog-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

/* Payment Method Tabs */
.payment-method-section {
  border-bottom: 1px solid var(--border-color);
}

.payment-tabs {
  display: flex;
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

/* Existing Methods */
.existing-methods {
  margin: 16px 24px;
  padding: 16px;
  background: var(--bg-light);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.existing-methods-header h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: var(--text-primary);
}

.existing-methods-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.existing-method-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
}

.method-info {
  flex: 1;
}

.method-name {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.method-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
}

.method-type-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.method-type-badge.card {
  background: #e3f2fd;
  color: #1976d2;
}

.method-type-badge.digital {
  background: #f3e5f5;
  color: #7b1fa2;
}
.method-actions {
  display: flex;
  gap: 8px;
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

.security-notice i {
  color: var(--success-green);
}

/* Form Styles */
.payment-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
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
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.2s;
}

.form-input :deep(.el-input__wrapper:hover) {
  border-color: #b0b3b8;
}

.form-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.1);
}

/* Card Input Specific */
.card-section {
  margin: 24px 0;
  padding: 20px;
  background: var(--bg-light);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

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

/* Digital Section */
.digital-section {
  margin: 24px 0;
  padding: 20px;
  background: var(--bg-light);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

/* Default Payment Section */
.default-payment-section {
  margin: 16px 0;
  padding: 12px;
  background: var(--bg-light);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.default-payment-checkbox {
  font-size: 14px;
  color: var(--text-primary);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button {
  flex: 1;
  height: 44px;
  border-color: var(--border-color);
  color: var(--text-secondary);
}

.save-button {
  flex: 2;
  height: 44px;
  background: var(--primary-blue);
  border-color: var(--primary-blue);
}

.save-button:hover {
  background: #3367d6;
  border-color: #3367d6;
}

/* Success Alert */
.success-alert {
  margin: 16px 24px;
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .add-payment-dialog :deep(.el-dialog) {
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
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>