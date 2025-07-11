<template>
    <div class="product-list-container">
      <div class="product-grid">
        <el-card
          v-for="product in products"
          :key="product.id"
          class="product-card"
          :class="{ 'out-of-stock': !product.inStock }"
          shadow="hover"
          :body-style="{ padding: '0' }"
        >
          <div class="product-image-wrapper">
            <el-image
              :src="product.image"
              :alt="product.name"
              class="product-image"
              fit="cover"
              lazy
              @error="handleImageError"
            >
              <template #error>
                <div class="image-error">Image not available</div>
              </template>
              <template #placeholder>
                <div class="image-placeholder">Loading...</div>
              </template>
            </el-image>
            <div v-if="!product.inStock" class="out-of-stock-overlay">
              Out of Stock
            </div>
          </div>
          <div class="product-content">
            <div class="product-header">
              <span class="product-name">{{ product.name }}</span>
              <el-tag v-if="product.isNew" type="success" size="small" class="new-badge">
                New
              </el-tag>
            </div>
            <div class="product-price">
              ₱{{ formatPrice(product.price) }}
              <span v-if="product.originalPrice" class="original-price">
                ₱{{ formatPrice(product.originalPrice) }}
              </span>
            </div>
            <div class="product-actions">
              <el-button
                type="primary"
                size="small"
                :disabled="!product.inStock"
                @click="addToCart(product)"
              >
                {{ product.inStock ? 'Add to Cart' : 'Unavailable' }}
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface Product {
    id: number
    name: string
    image: string
    price: number
    originalPrice?: number
    inStock: boolean
    isNew?: boolean
  }
  
  const products = ref<Product[]>([
    {
      id: 1,
      name: 'MacBook Pro',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
      price: 50000,
      originalPrice: 55000,
      inStock: true,
      isNew: true,
    },
    {
      id: 2,
      name: 'iPhone 14',
      image: 'https://images.unsplash.com/photo-1664478546383-7ad8e38384ad?auto=format&fit=crop&w=400&q=80',
      price: 45000,
      inStock: true,
      isNew: false,
    },
    {
      id: 3,
      name: 'AirPods Pro',
      image: 'https://images.unsplash.com/photo-1600294037681-c80d2157b99b?auto=format&fit=crop&w=400&q=80',
      price: 12000,
      inStock: false,
      isNew: true,
    },
  ])
  
  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
  
  const handleImageError = (event: Event): void => {
    console.error('Failed to load image:', event)
  }
  
  const addToCart = (product: Product): void => {
    if (product.inStock) {
      console.log(`Added ${product.name} to cart`)
      // Implement actual cart logic here
    }
  }
  </script>
  
  <style scoped>
  .product-list-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    justify-items: center;
    align-items: center;
  }
  
  .product-card {
    width: 100%;
    max-width: 280px;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .product-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
  
  .product-image-wrapper {
    position: relative;
    height: 200px;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px 12px 0 0;
  }
  
  .image-error,
  .image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: #f5f5f5;
    color: #999;
    font-size: 14px;
  }
  
  .out-of-stock-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
  }
  
  .product-content {
    padding: 16px;
    align-items: center;
  }
  
  .product-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .product-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
  
  .new-badge {
    font-size: 12px;
  }
  
  .product-price {
    font-size: 18px;
    font-weight: bold;
    color: #e44d26;
    margin-bottom: 12px;
  }
  
  .original-price {
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
    margin-left: 8px;
  }
  
  .product-actions {
    display: flex;
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    .product-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }
  
    .product-card {
      max-width: 100%;
    }
  
    .product-list-container {
      padding: 16px;
    }
  }
  
  @media (max-width: 480px) {
    .product-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>