<template>
    <section class="for-you">
      <div class="for-you-header">
        <h2 class="h2">For You</h2>
      </div>
  
      <div class="for-you-content jfy-comp-container">
        <div class="hp-mod-card-content">
          <div class="card-jfy-wrapper">
  
            <!-- Repeat this block per item -->
            <div class="for-you-item" v-for="item in forYou" :key="item.id">
              <el-card class="for-you-card" shadow="never">
                <div class="product-image-container">
                  <img :src="item.image" alt="Product Image" class="product-image" />
                  <div class="discount-badge" v-if="item.discount">
                    {{ item.discount }}%
                  </div>
                </div>
  
                <div class="product-info">
                  <h3 class="product-title">{{ truncateString(item.name, 50) }}</h3>
                  <div class="price-section">
                    <div class="current-price">₱{{ item.price.toLocaleString() }}</div>
                    <div class="original-price" v-if="item.originalPrice">
                      ₱{{ item.originalPrice.toLocaleString() }}
                    </div>
                    <div class="discount-text" v-if="item.discount">
                      -{{ item.discount }}%
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
            <!-- End repeat -->
  
          </div>
        </div>
      </div>
    </section>
  </template>

<script setup lang="ts">
import { truncateString } from '@/utils/truncate'
import { forYouList } from '@/constants/Data'

const forYou = forYouList



</script>



<style scoped>
.for-you-header {
  padding: 1rem 0;
}

.card-jfy-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  gap: 1rem;
}

.for-you-item {
  flex: 1 1 calc(25% - 1rem); /* 4 cards per row with gap */
  max-width: 25%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.for-you-card {
    padding: 0;
    display: flex;
    gap: 0.5rem;
}

.for-you-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.product-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 6px;
}

.product-info {
  padding: 0.5rem;
  text-align: left;
}

.product-title {
    font-size: 0.9rem; /* Slightly larger for readability */
  font-weight: 500; /* Medium weight for better emphasis */
  color: #1a1a1a; /* Darker color for better contrast */
  margin: 0 0 0.4rem 0;
  height: 2.7rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-family: 'Lato', 'Segoe UI', sans-serif;
  line-height: 1.35rem; /* Improve vertical spacing */
  word-break: break-word; /* Prevent layout breaks */
  transition: color 0.2s ease-in-out;
}

.product-title:hover {
    color: #f57224; /* Optional hover effect for interaction */
    cursor: pointer;
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

.discount-badge  {
    color: #f11523;
    font-size: 0.75rem;
    font-weight: 900;
    font-family: 'Lato', sans-serif;
}
</style>