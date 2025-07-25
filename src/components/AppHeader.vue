<!-- components/AppHeader.vue -->
<template>
    <el-header class="app-header">
      <div class="logo" @click="router.push('/')">DigiShop++</div>
      <div class="search-container">
        <AppSearch />
      </div>
      <div class="header-actions">
        <div class="cart">
          <el-button
          class="cart-button"
            @click="authStore.isAuthenticated ? router.push('/shopping-cart') : (uiStore.showLoginModal = true)"
          >
          <el-icon size="43" color="#0a1569"><ShoppingCart /></el-icon>
          </el-button>
        </div>
        
        <div class="user-profile" v-if="authStore.isAuthenticated">
          <el-dropdown trigger="click" @command="handleUserAction">
            <div class="avatar-container">
              <el-avatar
                size="large"
                src="https://975thefanatic.com/uploads/2020/03/GettyImages-51092292-e1584329313313.jpg?format=auto&optimize=high&width=1440"
                alt="User profile"
                class="user-avatar"
              />
              <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  My Profile
                </el-dropdown-item>
                <el-dropdown-item command="orders">
                  <el-icon><Document /></el-icon>
                  My Orders
                </el-dropdown-item>
                <el-dropdown-item command="wishlist">
                  <el-icon><Star /></el-icon>
                  Wishlist
                </el-dropdown-item>
                <el-dropdown-item divided command="settings">
                  <el-icon><Setting /></el-icon>
                  Settings
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  Logout
                </el-dropdown-item>
              </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

        <div class="user-profile" v-else>
          <LoginRegister />
        </div>
      </div>
    </el-header>
    
  </template>

  
  <script setup lang="ts">
  import { ShoppingCart, ArrowDown, User, Document, Star, Setting, SwitchButton } from '@element-plus/icons-vue'
  import AppSearch from '@/components/AppSearch.vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'
  import { onMounted, watchEffect } from 'vue'
  import LoginRegister from '@/components/LoginRegister.vue'
  import { computed } from 'vue'
  import { useAuth } from '@/stores/useAuth'    
  import { useModalStore } from '@/stores/useModalStore'


  const router = useRouter()
  const authStore = useAuthStore()
  const uiStore = useModalStore()


  const handleUserAction = (command: string) => {
    switch (command) {
      case 'profile':
        router.push({path: '/profile', query: {section: 'manage-my-profile'} })
        break
      case 'orders':
      router.push({ path: '/profile', query: { section: 'my-orders' } })
        break
      case 'wishlist':
        ElMessage.info('Wishlist page coming soon!')
        break
      case 'settings':
        ElMessage.info('Settings page coming soon!')
        break
      case 'logout':
        authStore.logout()
        break
    }
  }

  console.log('showLoginModal', uiStore.showLoginModal)


  watchEffect(() => {
  console.log('showLoginModal', uiStore.showLoginModal)
})
</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=League+Spartan:wght@100..900&family=Manufacturing+Consent&display=swap');


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
    margin-left: 15rem;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .cart {
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .cart:hover {
    transform: scale(1.05);
  }

  .user-profile {
    position: relative;
  }

  .avatar-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background-color 0.2s ease;
  }

  .avatar-container:hover {
    background-color: #f5f5f5;
  }

  .user-avatar {
    border: 2px solid #e0e0e0;
    transition: border-color 0.2s ease;
  }

  .user-avatar:hover {
    border-color: #0a1569;
  }

  .dropdown-arrow {
    font-size: 12px;
    color: #666;
    transition: transform 0.2s ease;
  }

  .avatar-container:hover .dropdown-arrow {
    transform: rotate(180deg);
  }

  .logo {
    font-family: 'League Spartan', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #0a1569;
    font-weight: bold;
    letter-spacing: 1px;
    cursor: pointer;
  }

  :deep(.el-dropdown-menu__item) {
    font-family: 'Lato', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #0a1569;
    font-weight: bold;
    letter-spacing: 1px;
  }

  :deep(.el-button--primary) {
     color: #409eff;
     background-color: #ffffff;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .search-container {
      margin-left: 1rem;
    }
    
    .header-actions {
      gap: 1rem;
    }
  }
  .cart-button {
  all: unset;              /* remove all default styling */
  cursor: pointer;         /* show pointer on hover */
  display: inline-flex;    /* align the icon properly */
  align-items: center;
  justify-content: center;
}

  
  </style>
  