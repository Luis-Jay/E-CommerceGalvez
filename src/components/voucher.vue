<template>
    <div class="voucher-container">
      <div class="voucher-header">
        <AppHeader />
      </div>
  
      <div class="voucher-content">
        <div class="voucher-hero">
          <h1 class="hero-title">Voucher & Coupon Codes</h1>
          <p class="hero-subtitle">Save more with our exclusive discount codes and special offers</p>
        </div>
  
        <div class="voucher-grid">
          <div class="voucher-card" v-for="(discount, code) in validCoupons" :key="code">
            <div class="voucher-badge">
              <span class="discount-percent">{{ Math.round(discount * 100) }}% OFF</span>
            </div>
            
            <div class="voucher-body">
              <div class="voucher-code-section">
                <span class="code-label">Coupon Code</span>
                <div class="code-container">
                  <span class="voucher-code">{{ code }}</span>
                  <button 
                    class="copy-button" 
                    @click="copyCode(code)"
                    :class="{ 'copied': copiedCodes.includes(code) }"
                  >
                    {{ copiedCodes.includes(code) ? 'Copied!' : 'Copy' }}
                  </button>
                </div>
              </div>
  
              <div class="voucher-details">
                <h3 class="voucher-name">{{ getVoucherName(code) }}</h3>
                <p class="voucher-description">{{ getVoucherDescription(code, discount) }}</p>
                
                <div class="voucher-info">
                  <div class="info-item">
                    <span class="info-label">Minimum Spend:</span>
                    <span class="info-value">₱{{ getMinimumSpend(discount) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Valid Until:</span>
                    <span class="info-value">{{ getExpiryDate() }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Usage:</span>
                    <span class="info-value">One time per account</span>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="voucher-footer">
              <button 
                class="apply-button" 
                @click="applyVoucher(code)"
                :disabled="!canApplyVoucher(code)"
                :class="{ 'applied': appliedVoucher === code }"
              >
                {{ appliedVoucher === code ? 'Applied' : 'Apply Now' }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- Applied Voucher Summary -->
        <div v-if="appliedVoucher" class="applied-voucher-summary">
          <div class="summary-card">
            <div class="summary-header">
              <h3>Applied Voucher</h3>
              <button class="remove-voucher" @click="removeVoucher">×</button>
            </div>
            <div class="summary-content">
              <div class="voucher-info">
                <span class="voucher-code-applied">{{ appliedVoucher }}</span>
                <span class="voucher-discount">{{ Math.round(validCoupons[appliedVoucher] * 100) }}% OFF</span>
              </div>
              <div class="savings-info">
                <span class="savings-text">You save: ₱{{ calculateSavings() }}</span>
              </div>
            </div>
          </div>
        </div>
  
        <div class="terms-section">
          <h2 class="terms-title">Terms & Conditions</h2>
          <div class="terms-content">
            <ul class="terms-list">
              <li>Voucher codes are valid for online purchases only</li>
              <li>Each voucher can only be used once per account</li>
              <li>Vouchers cannot be combined with other promotional offers</li>
              <li>Minimum spend requirement must be met before discount application</li>
              <li>Vouchers are non-transferable and cannot be exchanged for cash</li>
              <li>We reserve the right to modify or cancel vouchers at any time</li>
              <li>Vouchers are valid until the expiry date specified</li>
            </ul>
          </div>
        </div>
      </div>
  
      <div class="voucher-footer">
          <AppFooter />
      </div>
  
      <!-- Checkout Modal -->
      <CheckoutDialog 
        :visible="showCheckout"
        :applied-voucher="appliedVoucher"
        :voucher-discount="appliedVoucher ? validCoupons[appliedVoucher] : 0"
        @close="showCheckout = false"
        @voucher-removed="handleVoucherRemoved"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, inject } from 'vue'
  import AppHeader from './AppHeader.vue'
  import AppFooter from './AppFooter.vue'
  import Checkout from './Checkout.vue'
  import { useCartStore } from '@/stores/cartStore'
  import { ElMessage } from 'element-plus'
  
  // Inject cart store or use composable
  const cartStore = useCartStore()
  
  const validCoupons: Record<string, number> = {
    SAVE10: 0.10,
    WELCOME: 0.15,
    STUDENT: 0.20,
    FIRST: 0.25
  }
  
  const copiedCodes = ref<string[]>([])
  const appliedVoucher = ref<string>('')
  const showCheckout = ref(false)
  
  // Methods
  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      copiedCodes.value.push(code)
      
      // Remove from copied list after 2 seconds
      setTimeout(() => {
        const index = copiedCodes.value.indexOf(code)
        if (index > -1) {
          copiedCodes.value.splice(index, 1)
        }
      }, 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      copiedCodes.value.push(code)
      setTimeout(() => {
        const index = copiedCodes.value.indexOf(code)
        if (index > -1) {
          copiedCodes.value.splice(index, 1)
        }
      }, 2000)
    }
  }
  
  const canApplyVoucher = (code: string): boolean => {
    const minimumSpend = parseInt(getMinimumSpend(validCoupons[code]))
    const cartTotal = cartStore.subtotal || 0
    
    // Check if cart meets minimum spend requirement
    if (cartTotal < minimumSpend) {
      return false
    }
    
    // Check if cart has items
    if (!cartStore.items || cartStore.items.length === 0) {
      return false
    }
    
    return true
  }
  
  const applyVoucher = (code: string) => {
    // Check if cart is empty
    if (!cartStore.items || cartStore.items.length === 0) {
      ElMessage.warning('Please add items to your cart before applying a voucher')
      return
    }
  
    const minimumSpend = parseInt(getMinimumSpend(validCoupons[code]))
    const cartTotal = cartStore.subtotal || 0
  
    // Check minimum spend requirement
    if (cartTotal < minimumSpend) {
      ElMessage.error(`Minimum spend of ₱${minimumSpend} required for this voucher. Your current total is ₱${cartTotal.toFixed(2)}`)
      return
    }
  
    // Remove any previously applied voucher
    if (appliedVoucher.value) {
      removeVoucher()
    }
  
    // Apply the new voucher
    appliedVoucher.value = code
    
    // Update cart store with voucher
    cartStore.applyVoucher(code, validCoupons[code])
    
    ElMessage.success(`Voucher ${code} applied! You save ₱${calculateSavings()}`)
    
    // Auto-open checkout or redirect to cart
    setTimeout(() => {
      showCheckout.value = true
    }, 1000)
  }
  
  const removeVoucher = () => {
    if (appliedVoucher.value) {
      cartStore.removeVoucher()
      appliedVoucher.value = ''
      ElMessage.info('Voucher removed')
    }
  }
  
  const handleVoucherRemoved = () => {
    removeVoucher()
  }
  
  const calculateSavings = (): string => {
    if (!appliedVoucher.value) return '0.00'
    
    const discount = validCoupons[appliedVoucher.value]
    const cartTotal = cartStore.subtotal || 0
    const savings = cartTotal * discount
    
    return savings.toFixed(2)
  }
  
  const getVoucherName = (code: string): string => {
    const names: Record<string, string> = {
      SAVE10: 'Save More Deal',
      WELCOME: 'Welcome Bonus',
      STUDENT: 'Student Discount',
      FIRST: 'First Purchase Special'
    }
    return names[code] || 'Special Discount'
  }
  
  const getVoucherDescription = (code: string, discount: number): string => {
    const descriptions: Record<string, string> = {
      SAVE10: 'Perfect for everyday savings on your favorite items',
      WELCOME: 'Welcome to our store! Enjoy this special discount on your order',
      STUDENT: 'Exclusive discount for students with valid ID verification',
      FIRST: 'First-time shopper? Get the best deal on your inaugural purchase'
    }
    return descriptions[code] || `Get ${Math.round(discount * 100)}% off your purchase`
  }
  
  const getMinimumSpend = (discount: number): string => {
    // Calculate minimum spend based on discount percentage
    const minimums: Record<number, number> = {
      0.10: 500,
      0.15: 750,
      0.20: 1000,
      0.25: 1500
    }
    return minimums[discount]?.toString() || '500'
  }
  
  const getExpiryDate = (): string => {
    const date = new Date()
    date.setMonth(date.getMonth() + 3) // 3 months from now
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  </script>

<style scoped>
.voucher-container {
  width: 100%;
  min-height: 100vh;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
}

.voucher-header {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.voucher-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Hero Section */
.voucher-hero {
  text-align: center;
  margin-bottom: 50px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  letter-spacing: -0.025em;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Voucher Grid */
.voucher-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

.voucher-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.voucher-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.voucher-badge {
  background: #f57224;
  color: white;
  padding: 8px 16px;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
}

.discount-percent {
  font-size: 1.25rem;
  font-weight: 700;
}

.voucher-body {
  padding: 24px;
}

.voucher-code-section {
  margin-bottom: 20px;
}

.code-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.code-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
}

.voucher-code {
  font-family: 'Courier New', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: 2px;
  flex: 1;
}

.copy-button {
  background: #374151;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-button:hover {
  background: #1f2937;
}

.copy-button.copied {
  background: #059669;
}

.voucher-details {
  margin-bottom: 20px;
}

.voucher-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.voucher-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
}

.voucher-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 600;
}

.voucher-footer {
  padding: 0 24px 24px;
}

.apply-button {
  width: 100%;
  background: #1f2937;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-button:hover {
  background: #374151;
  transform: translateY(-1px);
}

/* Terms Section */
.terms-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  border: 1px solid #e5e7eb;
}

.terms-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
}

.terms-content {
  color: #6b7280;
  line-height: 1.6;
}

.terms-list {
  list-style: none;
  padding: 0;
}

.terms-list li {
  padding: 8px 0;
  padding-left: 24px;
  position: relative;
}

.terms-list li::before {
  content: '•';
  color: #9ca3af;
  font-weight: bold;
  position: absolute;
  left: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .voucher-content {
    padding: 20px 16px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .voucher-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .voucher-card {
    margin: 0;
  }

  .code-container {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .voucher-info {
    gap: 4px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .terms-section {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .voucher-body {
    padding: 16px;
  }

  .voucher-footer {
    padding: 0 16px 16px;
  }
}

.voucher-footer {
    width: 100%;
    height: 100px;
    background-color: #f5f5f5;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>