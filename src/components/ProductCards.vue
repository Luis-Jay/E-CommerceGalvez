<!-- components/FlashSale.vue -->
<template>
    <section class="flash-sale">
      <div class="header">
        <h2 class="h2">Flash Sale</h2>
        <div class="timer-section">
          <span class="on-sale-text">On Sale Now</span>
          <div class="timer">
            <span class="timer-label">Ending in</span>
            <div class="timer-values">
              <div><span class="time-unit">0</span> <span class="timer-label"></span></div>
              <div><span class="time-unit">0</span> <span class="timer-label"></span></div>
              <div><span class="time-unit">0</span> <span class="timer-label"></span></div>
              <div><span class="time-unit">0</span> <span class="timer-label"></span></div>
            </div>
          </div>
          <button class="shop-all-btn" @click="goToShopAll()">SHOP ALL PRODUCTS</button>
        </div>
      </div>

      <div class="product-grid">
        <el-card
          v-for="item in items"
          :key="item.id"
          class="product-card"
          shadow="never"
          @click="goToProduct(item.id)"
        >
          <div class="product-image-container">
          <img
            :src="Array.isArray(item.image) ? (item.image.length > 1 ? item.image[0] : item.image[0]) : item.image"
            alt="product"
            class="product-image"
            v-if="item.image"
          />
            <div class="discount-badge" v-if="item.discount">{{ item.discount }}%</div>
          </div>

          <div class="product-info">

            <h3 class="product-title">{{ truncateString(item.name, 25) }}</h3>
            <div class="price-section">
              <div class="current-price">₱{{ item.price.toLocaleString() }}</div>
              <div class="original-price" v-if="item.originalPrice">₱{{ item.originalPrice.toLocaleString() }}</div>
              <div class="discount-text" v-if="item.discount">-{{ item.discount }}%</div>
            </div>
          </div>
          <span class="cart-icon" @click.stop="addToCart(item)">
            <el-icon><ShoppingCart /></el-icon>
          </span>
        </el-card>
      </div>
    </section>
  </template>


  <script setup lang="ts">
  import { truncateString } from '@/utils/truncate'
 import { itemList } from '@/constants/Data'
 import { useRouter } from 'vue-router'
 import { ShoppingCart } from '@element-plus/icons-vue'
 import { useCartStore } from '@/stores/cartStore'
 import { useAuthStore } from '@/stores/authStore'
 import { showMessageOnce } from '@/utils/showMessageOnce'
 import { ref } from 'vue'
 import { useModalStore } from '@/stores/useModalStore'

 const router = useRouter()
 const cartStore = useCartStore()
 const authStore = useAuthStore()
 const product = ref<any | null>(null);

 function goToProduct(id: string | number) {
  router.push({ name: 'ProductPage', params: { id } })
 }


 const uiStore = useModalStore()

function goToShopAll() {
  router.push({ name: 'ShopallProducts' })
}

function addToCart(item: any) {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    uiStore.showLoginModal = true
    return
  }

  // Transform product data to CartItem format
  const cartItem = {
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: 1,
    image: Array.isArray(item.image) ? item.image[0] : item.image,
    size: '',
    color: '',
    currentPrice: item.price,
    originalPrice: item.originalPrice || item.price,
    onSale: item.originalPrice && item.originalPrice > item.price,
    totalPrice: item.price,
    deliveryOption: 'DPD',
    deliveryFee: 0
  }
  authStore.addToUserCart(cartItem)
  showMessageOnce('Added to cart!', 'success')
  console.log('user cart items:', authStore.currentUser?.cartItems)
}

  const items = itemList

  function countDown() {
    const now = new Date();
    const endDate = new Date('2025-08-11T12:00:00');
    const timeDiff = endDate.getTime() - now.getTime();

    if(timeDiff <= 0) {
      document.querySelectorAll('.time-unit').forEach(el => el.textContent = '0');
      return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    const timerValues = [days, hours, minutes, seconds];
    const timerElements = document.querySelectorAll('.time-unit');

    timerElements.forEach((element, index) => {
      element.textContent = timerValues[index].toString().padStart(2, '0');
    });
  }

  countDown();

  setInterval(countDown, 1000);
  </script>

  <style scoped>
  * {
    box-sizing: border-box;
    font-family: 'Roboto', 'Arial', sans-serif;
  }

  .flash-sale {
    background-color: #ffffff;
    padding: 0;
    margin-bottom: 2rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .h2 {
    font-size: 1.25rem;
    font-weight: 500;
    color: #f57224;
    margin: 0;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .timer-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .on-sale-text {
    color: #ff6600;
    font-size: 0.9rem;
    font-weight: 500;
    justify-content: space-between;
    margin-left: 1rem;
    margin-right: 1rem;
    font-family: 'Lato', sans-serif;
  }

  .timer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .timer-label {
    color: #666;
    font-size: 0.9rem;
  }

  .timer-values {
    display: flex;
    gap: 0.25rem;
  }

  .time-unit {
    background: #ff6600;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-size: 0.9rem;
    font-weight: 500;
    min-width: 24px;
    text-align: center;
  }

  .shop-all-btn {
    background: transparent;
    border: 1px solid #ff6600;
    color: #ff6600;
    padding: 0.5rem 1rem;
    border-radius: 3px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .shop-all-btn:hover {
    background: #ff6600;
    color: white;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1px;
    background: #f5f5f5;
    border: 1px solid #f0f0f0;
  }

  .product-card {
    background: #fff;
    border-radius: 0;
    padding: 1rem;
    border: none;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
  }

  .product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .product-image-container {
    position: relative;
    margin-bottom: 0.75rem;
  }

  .product-image {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 4px;
    background: #f8f8f8;
  }

  .discount-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: #ff424f;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0 4px 0 4px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .product-info {
    text-align: left;
  }

  .product-title {
    font-size: 0.85rem;
    font-weight: 400;
    color: #212121;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
    height: 2.6rem;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .price-section {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .current-price {
    color: #ff6600;
    font-weight: 600;
    font-size: 1rem;
  }

  .original-price {
    color: #999;
    font-size: 0.8rem;
    text-decoration: line-through;
  }

  .discount-text {
    color: #ff424f;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .cart-icon {
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 2;
    cursor: pointer;
    font-size: 24px;
    background: white;
    border-radius: 50%;
    padding: 6px;
    transition: background 0.2s, color 0.2s;
  }
  .cart-icon:hover {

    color: rgb(112, 204, 247);
  }

  @media (max-width: 768px) {
    .product-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .timer-section {
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .product-card {
      padding: 0.75rem;
    }

    .product-image {
      height: 100px;
    }

    .product-title {
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .product-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  </style>
