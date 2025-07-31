<template>
  <div class="header">
    <AppHeader />
  </div>

  <!-- Product Page -->
  <div class="product-page">
    <!-- Breadcrumb -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/men' }">Men</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/men/tops' }">Tops</el-breadcrumb-item>
      <el-breadcrumb-item>{{ product?.name || 'Product' }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <el-icon :size="40" class="is-loading"><Loading /></el-icon>
    </div>
    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      {{ error }}
    </div>
    <!-- Main Content -->
    <div v-else-if="product" class="product-content">
      <!-- Image Gallery -->
      <div class="left-column">
        <el-image
          :src="selectedImage"
          fit="cover"
          class="main-image"
          alt="Product main image"
          :preview-src-list="product.image"
        />
        <div class="thumbnails">
          <el-image
            v-for="(img, idx) in displayedImages"
            :key="idx"
            :src="img"
            fit="cover"
            class="thumbnail"
            :class="{ active: selectedImage === img }"
            :alt="`Product thumbnail ${idx + 1}`"
            @click="selectedImage = img"
          />
          <div
            v-if="product.image && product.image.length > maxThumbnails"
            class="more-thumb"
            @click="showAllImages"
          >
            +{{ product.image.length - maxThumbnails }}
          </div>
        </div>
      </div>

      <!-- Details -->
      <div class="right-column">
        <h1 class="title">{{ product.name }}</h1>
        <p class="subtitle">{{ product.subtitle }}</p>

        <p class="description">
          {{ truncatedDescription }}
          <span
            v-if="isDescriptionLong"
            class="read-more"
            @click="isDescriptionExpanded = !isDescriptionExpanded"
          >
            {{ isDescriptionExpanded ? 'Read less' : 'Read more' }}
          </span>
        </p>

        <div class="stats">
          <el-tag type="success" disable-transitions>
            {{ product.sold }}+ Sold
          </el-tag>
          <el-rate
            :model-value="product.rating"
            disabled
          />
          <span class="review-count">({{ product.reviews }} reviews)</span>
        </div>

        <div class="price">
          <span class="current" v-if="product.price != null">
            {{ formatPrice(product.price) }}
          </span>
          <span class="original" v-if="product.originalPrice != null">
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>

        <!-- Actions -->
        <div class="actions">
          <el-button
            type="success"
            size="large"
            class="add-to-cart"
            @click="addToCart"
          >
            + Add to Cart
          </el-button>
          <el-button
            type="primary"
            size="large"
            class="buy-now"
            @click="buyNow"
            
          >
            Buy Now
          </el-button>
        </div>

        <!-- Footer Links -->
        <div class="extras">
          <el-button type="text" :icon="ChatDotRound" @click="onChat">
            Chat
          </el-button>
          <el-button type="text" :icon="Star" @click="onWishlist">
            Wishlist
          </el-button>
          <el-button type="text" :icon="Share" @click="onShare">
            Share
          </el-button>
        </div>
      </div>
    </div>

    <!-- Comment Rating -->
    <div v-if="product" class="rating-container mt-8">
      <!-- Rating Bars -->
      <div class="rating-bars">
        <div class="rating-row flex items-center gap-4 mb-2" v-for="item in product.ratings" :key="item.stars">
          <span class="star-label w-10">{{ item.stars }} ★</span>
          <el-progress
            :percentage="item.percent"
            :show-text="false"
            color="#f7ba2a"
            class="rating-progress flex-1"
          />
          <span class="percent-label w-10 text-right">{{ item.percent }}%</span>
        </div>
      </div>
    </div>

    <div class="for-you">
      <ForYou />
    </div>
  </div>
</template>

<script setup lang="ts">
import { itemList } from '@/constants/Data';
import { ref, computed, onMounted } from 'vue';
import { Loading, ChatDotRound, Star, Share } from '@element-plus/icons-vue';
import { truncateString } from '@/utils/truncate';
import { ElMessage } from 'element-plus';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import ForYou from '@/components/ForYou.vue'
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { showMessageOnce } from '@/utils/showMessageOnce';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const productId = route.params.id?.toString(); 
const product = ref<any | null>(null);

const isLoading = ref(true);
const error = ref<string | null>(null);
const maxThumbnails = 4;
const isDescriptionExpanded = ref(false);
const selectedImage = ref<string>('');

// computed properties
const displayedImages = computed(() => 
  product.value?.image ? product.value.image.slice(0, maxThumbnails) : []
);

const isDescriptionLong = computed(() => 
  (product.value?.description?.length || 0) > 100
);

const truncatedDescription = computed(() => {
  const description = product.value?.description || '';
  return isDescriptionExpanded.value
    ? description
    : `${description.slice(0, 100)}${description.length > 100 ? '...' : ''}`;
});

async function fetchProduct() {
  try {
    isLoading.value = true;
    
    // Simulate fetch delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundProduct = itemList.find(p => p.id.toString() === productId);
    
    if (!foundProduct) {
      throw new Error('Product not found');
    }

    product.value = foundProduct;
    selectedImage.value = foundProduct.image?.[0] || '';
  } catch (err) {
    error.value = 'Failed to load product details. Please try again later.';
    console.error('Error fetching product details:', err);
  } finally {
    isLoading.value = false;
  }
}

function formatPrice(price: number | null): string {
    if(price == null) return 'N/A'
    return new Intl.NumberFormat('en-PH', {style: 'currency', currency: 'PHP'}).format(price);
}

function showAllImages() {
  ElMessage.success('Opening full image gallery...')
}


import { useModalStore } from '@/stores/useModalStore'
const uiStore = useModalStore()


function addToCart() {
  const auth = useAuthStore()

  if(!auth.isAuthenticated) {
    uiStore.showLoginModal = true
    return
  }
  
  // Transform product data to CartItem format
  const cartItem = {
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    quantity: 1, // Default quantity
    image: Array.isArray(product.value.image) ? product.value.image[0] : product.value.image,
    size: '', // Empty string since size is not applicable
    color: '', // Empty string since color is not applicable
    currentPrice: product.value.price,
    originalPrice: product.value.originalPrice || product.value.price,
    onSale: product.value.originalPrice && product.value.originalPrice > product.value.price,
    totalPrice: product.value.price,
    deliveryOption: 'DPD',
    deliveryFee: 0
  }
  
  auth.addToUserCart(cartItem)
  showMessageOnce('Added to cart!', 'success')
  console.log('user cart items:', auth.currentUser?.cartItems)
  
}

function buyNow() {
  ElMessage.success('Redirecting to checkout...');
}

function onChat() {
  ElMessage.info('Opening chat...');
}

function onWishlist() {
  ElMessage.success('Added to wishlist!');
}

function onShare() {
  ElMessage.info('Share options...');
}

onMounted(() => {
  fetchProduct();
})
</script>

<style scoped>
.for-you {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
}

.rating-container {
  padding: 1rem;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  width: 100%;
  max-width: 300px;
  margin: 1rem auto; /* center it responsively */
  
  left: 1--;
  left: 450px;

  position: relative; /* allow positioning inside a normal flow */
}

.rating-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  gap: 12px;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
}

.rating-row:hover {
  background: #f8f9fa;
  border-color: #e9ecef;
  transform: translateX(4px);
}

.rating-row:last-child {
  margin-bottom: 0;
}

.star-label {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  min-width: 24px;
  display: flex;
  align-items: center;
  position: relative;
}

.star-label::after {
  content: "★";
  color: #f7ba2a;
  margin-left: 4px;
  font-size: 16px;
}

.rating-progress {
  flex: 1;
  margin: 0 8px;
}

.rating-progress :deep(.el-progress-bar__outer) {
  background-color: #f1f3f4;
  border-radius: 6px;
  height: 10px;
}

.rating-progress :deep(.el-progress-bar__inner) {
  background: linear-gradient(90deg, #f7ba2a 0%, #ffcc5c 100%);
  border-radius: 6px;
  transition: width 0.6s ease;
}

.percent-label {
  font-size: 13px;
  font-weight: 500;
  color: #6c757d;
  min-width: 40px;
  text-align: right;
}




.comments .comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  color: #303133;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 600;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.comments .comments-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Breadcrumb Styling */
.breadcrumb {
  margin-bottom: 20px;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: #666;
  font-size: 14px;
}

.breadcrumb :deep(.el-breadcrumb__inner:hover) {
  color: #409eff;
}

/* Loading and Error States */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.error-container {
  text-align: center;
  color: #f56c6c;
  padding: 40px;
  font-size: 16px;
}

/* Main Product Content */
.product-content {
  display: flex;
  gap: 40px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .product-content {
    flex-direction: column;
    gap: 20px;
  }
}

.left-column {
  flex: 1;
}

.right-column {
  flex: 1;
}

/* Image Gallery */
.main-image {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.main-image :deep(.el-image__inner) {
  border-radius: 8px;
}

.thumbnails {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.thumbnail:hover {
  border-color: #409eff;
}

.thumbnail.active {
  border-color: #409eff;
}

.thumbnail :deep(.el-image__inner) {
  border-radius: 4px;
}

.more-thumb {
  width: 80px;
  height: 80px;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: background-color 0.3s;
}

.more-thumb:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

/* Product Details */
.title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #303133;
  line-height: 1.3;
}

.subtitle {
  color: #909399;
  font-size: 16px;
  margin-bottom: 15px;
  line-height: 1.4;
}

.description {
  font-size: 15px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}

.read-more {
  color: #409eff;
  cursor: pointer;
  font-weight: 500;
  margin-left: 5px;
}

.read-more:hover {
  color: #66b1ff;
}

/* Stats Section */
.stats {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stats :deep(.el-tag) {
  font-size: 12px;
}

.stats :deep(.el-rate) {
  margin-right: 5px;
}

.review-count {
  color: #909399;
  font-size: 14px;
}

/* Price Section */
.price {
  margin: 25px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.current {
  font-size: 24px;
  font-weight: 700;
  color: #e6a23c;
}

.original {
  font-size: 18px;
  color: #c0c4cc;
  text-decoration: line-through;
}

/* Options */
.color, .size {
  margin: 25px 0;
}

.option-label {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #303133;
}

.swatches {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.swatch {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 2px solid #dcdfe6;
  cursor: pointer;
  transition: all 0.3s;
}

.swatch:hover {
  transform: scale(1.1);
}

.swatch.selected {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.size-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.size-btn {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  min-width: 40px;
  text-align: center;
}

.size-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.size-btn.selected {
  border-color: #409eff;
  background-color: #ecf5ff;
  color: #409eff;
}

/* Actions */
.actions {
  display: flex;
  gap: 15px;
  margin: 30px 0;
}

.actions :deep(.el-button) {
  flex: 1;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

.add-to-cart :deep(.el-button) {
  background-color: #67c23a;
  border-color: #67c23a;
}

.add-to-cart :deep(.el-button:hover) {
  background-color: #85ce61;
  border-color: #85ce61;
}

.buy-now :deep(.el-button) {
  background-color: #409eff;
  border-color: #409eff;
}

.buy-now :deep(.el-button:hover) {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

/* Footer Links */
.extras {
  display: flex;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.extras :deep(.el-button) {
  color: #909399;
  font-size: 14px;
}

.extras :deep(.el-button:hover) {
  color: #409eff;
}


/* Responsive Design */
@media (max-width: 768px) {
  .product-page {
    padding: 15px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .extras {
    justify-content: space-around;
  }
}
</style>