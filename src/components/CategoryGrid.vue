<!-- components/CategoryGrid.vue -->
<template>
    <section class="categories">
      <h2>Categories</h2>
      <div class="grid">
        <div v-for="cat in categories" :key="cat.name" class="category-tile">
          <img :src="cat.icon" />
          <p>{{ cat.name }}</p>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
import { categoryList } from '@/constants/Data'

  const categories = categoryList
    
  </script>
  
  <style scoped>
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
  align-items: center;
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
  