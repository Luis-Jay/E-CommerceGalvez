<template>
    <div>
        <main class="main-content">
      <AppHeader />
      <HomeBanner />
      <ProductCards />
      <CategoryGrid />
      <ForYou />
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  // Import your layout components
  import AppHeader from '@/components/AppHeader.vue'
  import HomeBanner from '@/components/HomeBanner.vue'
  import ProductCards from '@/components/ProductCards.vue'
  import CategoryGrid from '@/components/CategoryGrid.vue'
  import ForYou from '@/components/ForYou.vue'
  </script>
  
<style scoped>
.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
}
</style>

<style>
body {
    background-color: #f5f5f5;
}
</style>