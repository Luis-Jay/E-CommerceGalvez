<template>
  <div class="app-drawer">
    <slot name="trigger" :handleOpenDrawer="openDrawer"></slot>
    
    <div v-if="isOpen" class="drawer-overlay" @click="closeDrawer">
      <div class="drawer-content" @click.stop>
        <div class="drawer-header">
          <h3>Search</h3>
          <button @click="closeDrawer" class="close-btn">×</button>
        </div>
        <div class="drawer-body">
          <input 
            type="text" 
            placeholder="Search products..."
            class="drawer-search-input"
            v-model="searchQuery"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isOpen = ref(false)
const searchQuery = ref('')

const openDrawer = () => {
  isOpen.value = true
}

const closeDrawer = () => {
  isOpen.value = false
}
</script>

<style scoped>
.app-drawer {
  position: relative;
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
}

.drawer-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.drawer-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.drawer-body {
  padding: 20px;
}

.drawer-search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.drawer-search-input:focus {
  outline: none;
  border-color: #f57224;
}
</style> 