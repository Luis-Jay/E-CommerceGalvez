<!-- components/HomeBanner.vue -->
<template>
    <div class="banner-layout">
      <el-carousel height="300px" autoplay class="banner-carousel">
        <el-carousel-item v-for="(image, index) in bannerImages" :key="index">
          <img :src="image" :alt="`Banner ${index + 1}`" class="banner-image" />
        </el-carousel-item>
      </el-carousel>
  
      <div class="feature-cards">
        <el-card v-for="(card, index) in cards" :key="index" shadow="hover" class="feature-card" @click="handleUserAction(card.command)">
          <div class="card-content">
            <div class="text">
              <div class="card-title"><strong>{{ card.title }}</strong></div>
              <div class="card-subtitle">{{ card.subtitle }}</div>
            </div>
            <img :src="card.image" :alt="`feature ${index + 1}`" class="feature-image" />
          </div>
        </el-card>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const cards = [
    { title: 'Top Up', subtitle: 'Pay Bills', image: 'https://img.lazcdn.com/us/domino/bf9403bb-c546-4646-815e-dc3126f8f14c_PH-276-260.png_300x300q80.png', command: 'topup'},
    { title: 'Vouchers', subtitle: 'Collect & Redeem', image: 'https://img.lazcdn.com/us/domino/feebd9c2-3167-4642-9c9d-1ec637046df8_PH-276-260.png_300x300q80.png', command: 'vouchers'},
    { title: 'LazMall', subtitle: 'Shop Brands', image: 'https://img.lazcdn.com/us/domino/92419c5c-19b8-4f17-a88c-6c7e3745d9a4_PH-276-260.png_300x300q80.png', command: 'lazmall'},
  ]

  const handleUserAction = (command: string) => {
  switch (command) {
    case 'topup':
      router.push({ path: '/profile', query: { section: 'lazada-wallet' } })
      break
    case 'vouchers':
      router.push({ path: '/profile', query: { section: 'vouchers' } })
      break
    case 'lazmall':
      router.push({ path: '/profile', query: { section: 'lazmall' } })
      break
    default:
      // Optionally handle unknown commands
      break
  }
}

  const bannerImages = [
    'https://img.lazcdn.com/g/tps/imgextra/i2/O1CN01jrlONu1zk0uVKavg4_!!6000000006751-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif',
    'https://img.lazcdn.com/g/tps/imgextra/i3/O1CN01y1bIxh1WxBRYz1pje_!!6000000002854-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif',
    'https://img.lazcdn.com/g/tps/imgextra/i1/O1CN01NqJLRb1Jm6rWKSeXG_!!6000000001070-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif',
    'https://img.lazcdn.com/g/tps/imgextra/i2/O1CN01EV18yt1W4gJN6lpOK_!!6000000002735-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif',
    'https://img.lazcdn.com/g/tps/imgextra/i3/O1CN01OPzNdz1moVnTRR7y7_!!6000000005001-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif'
  ]
  </script>
  
  <style scoped>
  .banner-layout {
    font-family: 'Roboto-Regular', Helvetica Neue, Helvetica, Tahoma, Arial, Sans-serif;
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 1rem;
    padding: 2rem;
  }
  
  .feature-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: fit-content;
    cursor: pointer;
  }

  .feature-card {
    margin: 0;
    border-radius: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .feature-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .card-title {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    line-height: 1.2;
  }

  .card-subtitle {
    font-size: 0.875rem;
    color: #666;
    line-height: 1.2;
  }

  :deep(.el-card__body) {
    padding: 1rem;
  }

  :deep(.el-carousel__container) {
    height: 300px !important;
    border-radius: 10px;
    overflow: hidden !important;
  }
  </style>