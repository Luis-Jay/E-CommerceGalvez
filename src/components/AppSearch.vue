<template>
  <div class="app-search">
    <div class="search-group">
    <el-autocomplete
      v-model="state"
      placeholder="Search products..."
      class="input"
      :fetch-suggestions="querySearchAsync"
      @select="handleSelect"
      popper-class="custom-autocomplete"
    >
    <template #default="{ item }">
      <div class="custom-item">{{ item.value }}</div>
    </template>
    </el-autocomplete>
    <button class="search-button">
        <el-icon><Search /></el-icon>
    </button>
  </div>
</div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue';
import { ref, onMounted } from 'vue';

const state = ref('');


interface Product {
    value: string;
    label: string;
}

const products = ref<Product[]>([])

const loadProduct = (): Product[] => {
  return [
    { value: 'Gaming Laptop', label: 'Gaming Laptop' },
    { value: 'Smartphone', label: 'Smartphone' },
    { value: 'Tablet', label: 'Tablet' },
    { value: 'Smartwatch', label: 'Smartwatch' },
    { value: 'Headphones', label: 'Headphones' },
    { value: 'Keyboard', label: 'Keyboard' },
    { value: 'Mouse', label: 'Mouse' }
  ]
}

const createFilter = (queryString: string) => {
    return (product: Product) => 
       product.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
}

const querySearchAsync = (
    queryString: string,
     cb: (results: Product[]) => void
    ) => {
    const results = queryString 
    ? products.value.filter(createFilter(queryString)) 
    : products.value
    cb(results)
}

const handleSelect = (item: Product) => {
    console.log('selected', item)
}

onMounted(() => {
    products.value = loadProduct()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=League+Spartan:wght@100..900&family=Manufacturing+Consent&display=swap');


.app-search {
  display: flex;
  align-items: center;
  gap: 0.5em;
  max-width: 400px;
}

.search-group {
    display: flex;
    align-items: center;
    background-color: #f3f3f3;
    border-radius: 10px;
    overflow: hidden;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;
    width: 20em;
}

:deep(.el-input) {
    flex: 1;
}

:deep(.el-input__inner) {
    border: none !important;
    background-color: transparent;
    padding: 0.8em;
    font-size: 1em;
    height: 2.5em;
    font-family: 'Lato', sans-serif;
}

:deep(.el-input__wrapper) {
    background-color: transparent !important;
    box-shadow: none !important;
}

.search-button {
  width: 2.5em;
  height: 2.5em;
  background-color: #f57224;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #e65a1a;
}

.search-button:focus {
  outline: 2px solid #f57224;

}

.el-icon {
  font-size: 1.2em;
  margin: 0;
}

.custom-autocomplete .custom-item {
  font-family: 'Lato', sans-serif;
  font-size: 16px;
  font-weight: 400;
}




</style> 