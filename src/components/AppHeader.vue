<!-- components/AppHeader.vue -->
<template>
    <el-header class="app-header">
      <div class="logo">DigiShop++</div>
      <div class="search-container">
        <AppSearch />
      </div>
      <div class="cart">
        <el-icon size="43" color="#0a1569"><ShoppingCart /></el-icon>
      </div>
    </el-header>
  </template>
  
  <script setup lang="ts">
  import { ShoppingCart } from '@element-plus/icons-vue'
  import AppSearch from '@/components/AppSearch.vue'
  </script>
  
  <style scoped>
  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80px;
    padding: 0 2rem;
    background-color: white;
    border-bottom: 1px solid #eee;
  }
  
  .search-container {
    flex: 1;
    margin: 0 2rem;
    width: 100%;
    margin-left:15rem;
  }
  
  .cart {
    cursor: pointer;
    margin-right: 20rem;
  }

  .logo {
    font-family: 'League Spartan', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #0a1569;
    font-weight: bold;
    letter-spacing: 1px;
  }

  </style>
  