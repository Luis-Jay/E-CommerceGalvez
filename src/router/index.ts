import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomePage from '../pages/HomePage.vue'
import Product from '../pages/Product.vue'
import Profile from '../views/profile.vue'

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
    }
  ],
})

export default router
