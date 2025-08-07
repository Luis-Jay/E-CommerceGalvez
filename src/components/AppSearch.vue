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
        :suffix-icon="isLoading ? 'el-icon-loading' : 'el-icon-search'"
      >
        <template #default="{ item }">
          <div class="custom-item">
            <el-image
              :src="Array.isArray(item.image) ? item.image[0] : item.image"
              fit="cover"
              style="width: 32px; height: 32px; margin-right: 10px;"
              v-if="item.image"
            />
            {{ item.value }}
          </div>
        </template>
      </el-autocomplete>
      <button class="search-button" @click="manualSearch">
        <el-icon><Search /></el-icon>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { itemList } from '@/constants/Data'

const state = ref('')
const isLoading = ref(false)
const router = useRouter()

interface Product {
  value: string
  id: string | number
  image?: string | string[]
}

const products = ref<Product[]>(itemList.map(item => ({
  value: item.name,
  id: item.id,
  image: item.image
})))

const querySearchAsync = (queryString: string, cb: (results: Product[]) => void) => {
  isLoading.value = true
  setTimeout(() => {
    let results: Product[]
    if (queryString) {
      results = products.value.filter(product =>
        product.value.toLowerCase().includes(queryString.toLowerCase())
      )
    } else {
      results = []
    }
    cb(results)
    isLoading.value = false
  }, 500)
}

const handleSelect = (item: Product) => {
  router.push({ name: 'ProductPage', params: { id: item.id } })
}

const manualSearch = () => {
  if (!state.value) return
  isLoading.value = true
  setTimeout(() => {
    const found = products.value.find(product =>
      product.value.toLowerCase() === state.value.toLowerCase()
    )
    if (found) {
      router.push({ name: 'ProductPage', params: { id: found.id } })
    }
    isLoading.value = false
  }, 500)
}
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
  display: flex;
  align-items: center;
}
</style>
