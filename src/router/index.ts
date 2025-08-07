import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore' // import Pinia auth store

import HomePage from '../pages/HomePage.vue'
import Product from '../pages/Product.vue'
import Profile from '../views/profile.vue'
import ShoppingCart from '../views/ShoppingCart.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/product',
      name: 'product',
      component: Product,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }, // protect profile (also blocks ?section=...)
    },
    {
      path: '/shopping-cart',
      name: 'shopping-cart',
      component: ShoppingCart,
      meta: { requiresAuth: true }, // protect shopping cart
    },
    {
      path: '/product/:id',
      name: 'ProductPage',
      component: () => import('@/views/ProductPage.vue'),
      props: true,
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('@/pages/CatergoryProducts.vue'),
    },
    {
      path: '/google-signin',
      name: 'google-signin',
      component: () => import('@/components/GoogleSignIn.vue'),
    },
    {
      path: '/vouchers',
      name: 'vouchers',
      component: () => import('@/components/voucher.vue'),
    },
    {
      path: '/shop-all',
      name: 'ShopallProducts',
      component: () => import('@/pages/ShopallProducts.vue'),
    },
  ],
})

// 🔒 Global navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isAuthenticated // check login state

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ path: '/' }) // redirect to home or login
  } else {
    next()
  }
})

export default router
