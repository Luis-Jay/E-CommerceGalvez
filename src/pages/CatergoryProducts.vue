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
          <button class="shop-all-btn">SHOP ALL PRODUCTS</button>
        </div>
      </div>
  
      <div class="product-grid">
        <el-card
          v-for="cat in categories"
          :key="cat.id"
          class="product-card"
          shadow="never"
          
        >
          <div class="product-image-container">
            <img :src="cat.image" alt="product" class="product-image" />
            <div class="discount-badge" v-if="cat.discount">{{ cat.discount }}%</div>

          </div>
  
          <div class="product-info">
            <h3 class="product-title">{{ truncateString(cat.name, 35) }}</h3>
            <div class="price-section">
              <div class="current-price">₱{{ cat.price.toLocaleString() }}</div>
              <div class="original-price" v-if="cat.originalPrice">₱{{ cat.originalPrice.toLocaleString() }}</div>
              <div class="discount-text" v-if="cat.discount">-{{ cat.discount }}%</div>
            </div>
          </div>
        </el-card>
      </div>
    </section>
  </template>
<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import { useCategoryProductsStore } from '@/stores/categoryProduts'
import { useRoute } from 'vue-router'
import { truncateString } from '@/utils/truncate'
import { itemList } from '@/constants/Data'

const categoryProductsStore = useCategoryProductsStore()
const categories = categoryProductsStore.getCategoryProductLists

const route = useRoute()
const category = route.query.category


</script>

<style scoped>

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
}

 .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
    padding: 1rem;
    text-align: center;
  }
  
  .category-tile img {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 0.5rem;
  width: 100px;
  height: 100px;
  object-fit: contain;
}


  .category-tile:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.category-tile {
  display: flex;
  flex-direction: column;
  align-categoriess: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #fff;
  border-radius: 12px;
  transition: 0.3s ease;
  
}

  

  .categories {
    background-color: #fff;
    width: 100%;
    padding: 0rem;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  }

  .categories h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #f57224;
    margin-bottom: 1rem;
    margin-left: 1.5rem;
    font-family: 'Lato', sans-serif;
  }

 
  </style>
  
