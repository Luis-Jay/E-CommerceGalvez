import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomePage from '../pages/HomePage.vue'
import Product from '../pages/Product.vue'
import Profile from '../views/profile.vue'
import ShoppingCart from '../views/ShoppingCart.vue'
import ProductPage from '../views/ProductPage.vue'
import CategoryProducts from '../pages/CatergoryProducts.vue'


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
    },
    {
      path: '/shopping-cart',
      name: 'shopping-cart',
      component: ShoppingCart,
    },
    {
      path: '/product/:id',
      name: 'ProductPage',
      component: () => import('@/views/ProductPage.vue'),
      props: true
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('@/pages/CatergoryProducts.vue'),
    }
  ],
})

export default router
