<template>
  <div class="product-page">
    <!-- Header -->
    <div class="header">
      <AppHeader />
    </div>

    <!-- Breadcrumb Navigation -->
    <section class="breadcrumb-section">
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/men' }">Men</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/men/tops' }">Tops</el-breadcrumb-item>
        <el-breadcrumb-item>{{ product?.name || 'Product' }}</el-breadcrumb-item>
      </el-breadcrumb>
    </section>

    <!-- Loading State -->
    <section v-if="isLoading" class="loading-section">
      <div class="loading-container">
        <el-icon :size="40" class="is-loading">
          <Loading />
        </el-icon>
      </div>
    </section>

    <!-- Error State -->
    <section v-else-if="error" class="error-section">
      <div class="error-container">
        {{ error }}
      </div>
    </section>

    <!-- Main Product Content -->
    <section v-else-if="product" class="product-section">
      <div class="product-content">
        <!-- Product Images -->
        <div class="product-images">
          <div class="main-image-container">
            <el-image
              :src="selectedImage"
              fit="cover"
              class="main-image"
              alt="Product main image"
              :preview-src-list="product.image"
            />
          </div>
          
          <div class="thumbnails-container">
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
                class="more-thumbnails"
                @click="showAllImages"
              >
                +{{ product.image.length - maxThumbnails }}
              </div>
            </div>
          </div>
        </div>

        <!-- Product Details -->
        <div class="product-details">
          <!-- Product Info -->
          <div class="product-info">
            <h1 class="product-title">{{ product.name }}</h1>
            <p class="product-subtitle">{{ product.subtitle }}</p>
            
            <div class="product-description">
              <p class="description-text">
                {{ truncatedDescription }}
                <span
                  v-if="isDescriptionLong"
                  class="read-more-toggle"
                  @click="isDescriptionExpanded = !isDescriptionExpanded"
                >
                  {{ isDescriptionExpanded ? 'Read less' : 'Read more' }}
                </span>
              </p>
            </div>
          </div>

          <!-- Product Stats -->
          <div class="product-stats">
            <div class="stats-row">
              <el-tag type="success" disable-transitions>
                {{ product.sold }}+ Sold
              </el-tag>
              <div class="rating-info">
                <el-rate
                  :model-value="product.rating"
                  disabled
                  show-score
                />
                <span class="review-count">({{ product.reviews }} reviews)</span>
              </div>
            </div>
          </div>

          <!-- Product Price -->
          <div class="product-price">
            <span v-if="product.price != null" class="current-price">
              {{ formatPrice(product.price) }}
            </span>
            <span v-if="product.originalPrice != null" class="original-price">
              {{ formatPrice(product.originalPrice) }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="product-actions">
            <el-button
              type="success"
              size="large"
              class="add-to-cart-btn"
              @click="addToCart"
            >
              + Add to Cart
            </el-button>
            <el-button
              type="primary"
              size="large"
              class="buy-now-btn"
              @click="buyNow"
            >
              Buy Now
            </el-button>
          </div>

          <!-- Extra Actions -->
          <div class="extra-actions">
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
    </section>

    <!-- Reviews and Ratings Section -->
    <section v-if="product" class="reviews-section">
      <div class="reviews-content">
        <!-- Rating Overview -->
        <div class="rating-overview">
          <h3 class="section-title">Customer Ratings</h3>
          <div class="rating-bars">
            <div 
              v-for="item in product.ratings" 
              :key="item.stars"
              class="rating-row"
            >
              <span class="star-label">{{ item.stars }} ★</span>
              <el-progress
                :percentage="item.percent"
                :show-text="false"
                color="#f7ba2a"
                class="rating-progress"
              />
              <span class="percent-label">{{ item.percent }}%</span>
            </div>
          </div>
        </div>

        <!-- Customer Reviews -->
        <div class="customer-reviews">
          <div class="reviews-header">
            <h3 class="section-title">Customer Reviews</h3>
            <span class="reviews-count">{{ reviews.length }} Reviews</span>
          </div>

          <div class="reviews-list">
            <div 
              v-for="review in reviews" 
              :key="review.id" 
              class="review-item"
            >
              <div class="review-avatar">
                <el-avatar :size="40" :style="{ background: '#3b82f6' }">
                  {{ review.userInitials }}
                </el-avatar>
              </div>
              
              <div class="review-content">
                <div class="review-header">
                  <span class="reviewer-name">{{ review.userName }}</span>
                  <el-rate
                    v-model="review.rating"
                    disabled
                    :colors="['#f59e0b', '#f59e0b', '#f59e0b']"
                    :max="5"
                    size="small"
                  />
                </div>
                <p class="review-text">{{ review.comment }}</p>
                <span class="review-date">{{ review.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recommendations Section -->
    <section class="recommendations-section">
      <ForYou />
    </section>
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


const reviews = ref([
  {
    id: 1,
    userInitials: 'JD',
    userName: 'John Doe',
    rating: 5,
    comment: 'Absolutely love this product! The quality is outstanding, and it exceeded my expectations. Highly recommend!',
    date: 'August 1, 2025',
  },
  {
    id: 2,
    userInitials: 'AS',
    userName: 'Alice Smith',
    rating: 4,
    comment: 'Really good product, works as advertised. Shipping was fast, but I wish it came in more colors.',
    date: 'July 28, 2025',
  },
  {
    id: 3,
    userInitials: 'MB',
    userName: 'Mark Brown',
    rating: 5,
    comment: 'Fantastic purchase! Easy to use and very durable. Will definitely buy again.',
    date: 'July 25, 2025',
  },
]);

onMounted(() => {
  fetchProduct();
})
</script>

<style scoped>
/* =========================
   BASE STYLES
   ========================= */
.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* =========================
   BREADCRUMB SECTION
   ========================= */
.breadcrumb-section {
  margin-bottom: 20px;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: #666;
  font-size: 14px;
}

.breadcrumb :deep(.el-breadcrumb__inner:hover) {
  color: #409eff;
}

/* =========================
   LOADING & ERROR STATES
   ========================= */
.loading-section {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-section {
  padding: 40px;
  text-align: center;
}

.error-container {
  color: #f56c6c;
  font-size: 16px;
}

/* =========================
   PRODUCT SECTION
   ========================= */
.product-section {
  margin-top: 20px;
}

.product-content {
  display: flex;
  gap: 40px;
}

/* =========================
   PRODUCT IMAGES
   ========================= */
.product-images {
  flex: 1;
}

.main-image-container {
  margin-bottom: 15px;
}

.main-image {
  width: 100%;
  height: 500px;
  border-radius: 8px;
}

.main-image :deep(.el-image__inner) {
  border-radius: 8px;
}

.thumbnails-container {
  width: 100%;
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

.more-thumbnails {
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

.more-thumbnails:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

/* =========================
   PRODUCT DETAILS
   ========================= */
.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Product Info */
.product-info {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 20px;
}

.product-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #303133;
  line-height: 1.3;
}

.product-subtitle {
  color: #909399;
  font-size: 16px;
  margin-bottom: 15px;
  line-height: 1.4;
}

.product-description {
  margin-bottom: 0;
}

.description-text {
  font-size: 15px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.read-more-toggle {
  color: #409eff;
  cursor: pointer;
  font-weight: 500;
  margin-left: 5px;
}

.read-more-toggle:hover {
  color: #66b1ff;
}

/* Product Stats */
.product-stats {
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.stats-row :deep(.el-tag) {
  font-size: 12px;
}

.rating-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-info :deep(.el-rate) {
  margin: 0;
}

.review-count {
  color: #909399;
  font-size: 14px;
}

/* Product Price */
.product-price {
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-price {
  font-size: 24px;
  font-weight: 700;
  color: #e6a23c;
}

.original-price {
  font-size: 18px;
  color: #c0c4cc;
  text-decoration: line-through;
}

/* Product Actions */
.product-actions {
  display: flex;
  gap: 15px;
  padding: 20px 0;
}

.product-actions :deep(.el-button) {
  flex: 1;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

.add-to-cart-btn :deep(.el-button) {
  background-color: #67c23a;
  border-color: #67c23a;
}

.add-to-cart-btn :deep(.el-button:hover) {
  background-color: #85ce61;
  border-color: #85ce61;
}

.buy-now-btn :deep(.el-button) {
  background-color: #409eff;
  border-color: #409eff;
}

.buy-now-btn :deep(.el-button:hover) {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

/* Extra Actions */
.extra-actions {
  display: flex;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.extra-actions :deep(.el-button) {
  color: #909399;
  font-size: 14px;
}

.extra-actions :deep(.el-button:hover) {
  color: #409eff;
}

/* =========================
   REVIEWS SECTION
   ========================= */
.reviews-section {
  margin-top: 40px;
  padding: 30px 0;
  border-top: 1px solid #ebeef5;
}

.reviews-content {
  display: flex;
  gap: 40px;
}

/* Rating Overview */
.rating-overview {
  flex: 1;
  max-width: 350px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.rating-bars {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  min-width: 40px;
  display: flex;
  align-items: center;
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

/* Customer Reviews */
.customer-reviews {
  flex: 2;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.reviews-count {
  font-size: 14px;
  color: #909399;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.review-avatar {
  flex-shrink: 0;
}

.review-content {
  flex: 1;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.reviewer-name {
  font-weight: 600;
  color: #303133;
  font-size: 15px;
}

.review-header :deep(.el-rate) {
  margin: 0;
}

.review-text {
  color: #606266;
  line-height: 1.6;
  margin: 10px 0;
  font-size: 14px;
}

.review-date {
  font-size: 12px;
  color: #909399;
}

/* =========================
   RECOMMENDATIONS SECTION
   ========================= */
.recommendations-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #ebeef5;
}

/* =========================
   RESPONSIVE DESIGN
   ========================= */
@media (max-width: 768px) {
  .product-page {
    padding: 15px;
  }
  
  .product-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .stats-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .extra-actions {
    justify-content: space-around;
  }
  
  .reviews-content {
    flex-direction: column;
    gap: 30px;
  }
  
  .rating-overview {
    max-width: 100%;
  }
  
  .review-item {
    padding: 15px;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  .main-image {
    height: 300px;
  }
  
  .thumbnail {
    width: 60px;
    height: 60px;
  }
  
  .more-thumbnails {
    width: 60px;
    height: 60px;
    font-size: 12px;
  }
  
  .product-actions :deep(.el-button) {
    height: 44px;
    font-size: 14px;
  }
}
</style>