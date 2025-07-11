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
  const categories = [
    { name: 'Mobiles', icon: 'https://img.lazcdn.com/g/p/8300ebef8932a1a758fec36ad5731248.png_170x170q80.png_.avif' },
    { name: 'Fashion', icon: 'https://img.lazcdn.com/g/p/4f3a9e19de3e580f91a4ecb0496f9048.jpg_170x170q80.jpg_.avif' },
    { name: 'Electronics', icon: 'https://img.lazcdn.com/g/p/d0e9e6614d525c4fae44a869cc23e5e3.jpg_170x170q80.jpg_.avif' },
    { name: 'Home & Living', icon: 'https://img.lazcdn.com/g/p/ee71645acaab070b325d9dbf3b5a4cca.png_170x170q80.png_.avif' },
    { name: 'Sports & Outdoors', icon: 'https://www.vanguardpkg.com/wp-content/uploads/2021/11/sports-and-outdoors-2.jpeg' },
    { name: 'Toys & Games', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpBrAZpKSPue5vnJlQnt6VUjfHhQi-FZawKQ&s' },
    { name: 'Health & Beauty', icon: 'https://img.lazcdn.com/g/p/26a2407683a4a0237c32a7dbdd63d374.jpg_170x170q80.jpg_.avif' },
    { name: 'Automotive', icon: 'https://cdn.britannica.com/82/155682-050-8E720FFA/Robots-automobile-assembly-line-Russia.jpg' },
    { name: 'Groceries', icon: 'https://d3jmn01ri1fzgl.cloudfront.net/photoadking/webp_thumbnail/japanese-laurel-and-gallery-grocery-ad-template-gww4z815989265.webp' },
  ]
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
  