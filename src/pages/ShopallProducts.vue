<template>
  <div class="shopall-products">
    <AppHeader />

    <section class="products-section">
      <el-row :gutter="24" class="products-grid">
        <el-col
          v-for="item in itemList"
          :key="item.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <el-card class="product-card" shadow="hover">
            <div class="product-image-wrap" @click="goToProduct(item.id)">
              <el-image
                :src="Array.isArray(item.image) ? item.image[0] : item.image"
                fit="cover"
                class="product-image"
                :alt="item.name"
              />
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ truncateString(item.name, 40) }}</h3>
              <div class="product-pricing">
                <span class="current-price">₱{{ item.price.toLocaleString() }}</span>
                <span
                  v-if="item.originalPrice"
                  class="original-price"
                >₱{{ item.originalPrice.toLocaleString() }}</span>
                <span
                  v-if="item.discount"
                  class="discount"
                >-{{ item.discount }}%</span>
              </div>
              <el-button
                type="primary"
                icon="el-icon-shopping-cart-full"
                size="small"
                class="add-cart-btn"
                @click.stop="addToCart(item)"
              >Add to Cart</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import { truncateString } from '@/utils/truncate'
import { itemList } from '@/constants/Data'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { showMessageOnce } from '@/utils/showMessageOnce'
import { ref } from 'vue'
import { useModalStore } from '@/stores/useModalStore'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const uiStore = useModalStore()

function goToProduct(id: string | number) {
  router.push({ name: 'ProductPage', params: { id } })
}

function addToCart(item: any) {
  if (!authStore.isAuthenticated) {
    uiStore.showLoginModal = true
    return
  }
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
}
</script>

<style scoped>
.shopall-products {
  background: #f8f9fb;
  min-height: 100vh;
}
.shopall-hero {
  text-align: center;
  padding: 2rem 0 1rem 0;
  background: linear-gradient(90deg, #f5f7fa 0%, #c3cfe2 100%);
  margin-bottom: 2rem;
}
.shopall-hero h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #222;
}
.shopall-hero .subtitle {
  color: #666;
  font-size: 1.1rem;
}
.products-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 2rem 1rem;
}
.products-grid {
  margin-top: 1rem;
}
.product-card {
  margin-bottom: 2rem;
  border-radius: 16px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.product-card:hover {
  box-shadow: 0 8px 32px 0 rgba(60, 72, 88, 0.15);
}
.product-image-wrap {
  cursor: pointer;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}
.product-image {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  transition: transform 0.2s;
}
.product-image-wrap:hover .product-image {
  transform: scale(1.05);
}
.product-info {
  padding: 1rem 0.5rem 0.5rem 0.5rem;
  text-align: center;
}
.product-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #222;
  min-height: 2.6em;
}
.product-pricing {
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.current-price {
  color: #e53935;
  font-size: 1.2rem;
  font-weight: 700;
}
.original-price {
  color: #888;
  text-decoration: line-through;
  font-size: 1rem;
}
.discount {
  color: #43a047;
  font-weight: 600;
  font-size: 1rem;
}
.add-cart-btn {
  margin-top: 0.5rem;
  width: 100%;
}
</style>
