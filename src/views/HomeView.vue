<template>
  <!-- Top Header Bar -->
  <header class="header-top">
    <div class="header__container container">
      <div class="header__contact">
        <span>(+63) 923 242 2324</span>
        <span>our location</span>
      </div>
      
      <p class="header__alert-news">
        Super Value Deals - Save more with coupons & up to 70% off!
      </p>
      
      <a href="#" class="header__top__action">
        Log In / Sign Up
      </a>
    </div>
  </header>
  

<el-header>
    <div class="header-content">
      <h1>LOGO</h1>

      <div class="content-wrapper">
        <AppSearch />

        <AppDrawer>
          <template #trigger>
            <el-icon
              size="35px"
              color="#f57224"
              class="search-icon"
            >
              <ShoppingCart />
            </el-icon>
          </template>
        </AppDrawer>
      </div>
    </div>
  </el-header>

  <!-- Hero Slideshow Section -->
  <div class="slideshow-container">
    <div 
      v-for="(slide, index) in slides" 
      :key="index"
      class="mySlides fade"
      :class="{ active: currentSlideIndex === index }"
      v-show="currentSlideIndex === index"
    >
      <div class="numbertext">{{ index + 1 }} / {{ slides.length }}</div>
      <img 
        :src="slide.image" 
        :alt="slide.alt"
        style="width:100%"
      >
    </div>

    <!-- Navigation Controls -->
    <a 
      class="prev" 
      @click="previousSlide"
      aria-label="Previous slide"
    >
      &#10094;
    </a>
    
    <a 
      class="next" 
      @click="nextSlide"
      aria-label="Next slide"
    >
      &#10095;
    </a>

    <!-- Slide Indicators -->
    <div style="text-align:center">
      <span
        v-for="(slide, index) in slides"
        :key="index"
        class="dot"
        :class="{ active: currentSlideIndex === index }"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
  
</template>


<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Search, ShoppingCart } from '@element-plus/icons-vue'
import ProductList from '@/products/productList.vue'
import AppSearch from '@/components/AppSearch.vue'
import AppDrawer from '@/components/AppDrawer.vue'

// Reactive properties
const slides = ref([
  {
    image: 'https://img.lazcdn.com/g/tps/imgextra/i4/O1CN017fJrBs1O6UxMaa9Q5_!!6000000001656-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif',
    alt: 'Slide 1'
  },
  {
    image: 'https://img.lazcdn.com/g/tps/imgextra/i1/O1CN01NqJLRb1Jm6rWKSeXG_!!6000000001070-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif',
    alt: 'Slide 2'
  },
  {
    image: 'https://img.lazcdn.com/g/tps/imgextra/i3/O1CN0133hi7r1V6gQXluICH_!!6000000002604-0-tps-1976-688.jpg_2200x2200q80.jpg_.avif',
    alt: 'Slide 3'
  }
])

const currentSlideIndex = ref(0)
const phoneNumber = ref('')
const showSuccessMessage = ref(false)
const errorMessage = ref('')
const trackingEmail = ref('')
const orderNumber = ref('')
const trackingError = ref('')
const isLoggedIn = ref(false)

let slideIndex: number = 1;

// Next/previous controls
function plusSlides(n: number): void {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n: number): void {
  showSlides(slideIndex = n);
}

function showSlides(n: number): void {
  const slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
  const dots = document.getElementsByClassName("dot") as HTMLCollectionOf<HTMLElement>;

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  if (slides.length > 0) {
    slides[slideIndex - 1].style.display = "block";
  }
  if (dots.length > 0) {
    dots[slideIndex - 1].className += " active";
  }
}

// Only run after DOM is mounted!
onMounted(() => {
  showSlides(slideIndex);
});

function previousSlide(): void {
  plusSlides(-1);
}

function nextSlide(): void {
  plusSlides(1);
}

function goToSlide(index: number): void {
  currentSlideIndex.value = index
  slideIndex = index + 1
  showSlides(slideIndex)
}

</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=League+Spartan:wght@100..900&display=swap');


/* Global Resets */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto-Regular', 'Helvetica Neue', Helvetica, Tahoma, Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
}

/* Header Container */
.site-header {
  width: 100%;
  background-color: #f7f7f7;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
  font-family: Roboto-Regular, Helvetica Neue, Helvetica, Tahoma, Arial, Sans-serif;
}

/* Header Navigation */
.header-nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  min-height: 25px;
}

/* Navigation Items */
.nav-item {
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  height: 25px;
  font-size: 12px;
  cursor: pointer;
  position: relative;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  border-radius: 4px;
  margin: 0 2px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transform: translateY(-1px);
}

/* Link Styles */
.nav-item a,
.nav-item span {
  text-decoration: none;
  color: inherit;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* Link Variants */
.highlight-link {
  color: #ff00aa !important;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.primary-link {
  color: #0F1568 !important;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.nav-item.special {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.nav-item.secondary {
  color: #9e9e9e;
}

/* Popup Containers */
.popup-container {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 999;
  min-width: 280px;
  overflow: hidden;
  margin-top: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.popup-container::before {
  content: '';
  position: absolute;
  top: -8px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #fff;
}

.nav-item:hover .popup-container {
  display: block;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Popup Content */
.popup-content {
  padding: 20px;
  color: #333;
}

/* Forms */
.phone-form,
.tracking-form {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.input-container {
  display: flex;
  margin-bottom: 15px;
}

.form-input {
  flex: 1;
  height: 36px;
  padding: 0 12px;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-button {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  margin-left: 8px;
  transition: all 0.3s ease;
}

.form-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Notifications */
.success-notification {
  margin-bottom: 15px;
}

.success-alert {
  color: #4caf50;
  font-weight: 500;
  padding: 8px 12px;
  background: #e8f5e8;
  border-radius: 4px;
  display: inline-block;
}

.error-notification {
  color: #f44336;
  font-weight: 500;
  margin-bottom: 15px;
}

/* Store Links */
.store-links {
  display: flex;
  gap: 20px;
  width: 400px;
  justify-content: space-between;
}

.store-button {
  width: 1100px;
  height: 40px;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.store-button:hover {
  background: transparent;
  transform: translateY(-2px);
}

/* Support Popup */
.support-content {
  min-width: 250px;
}

.support-list {
  list-style: none;
  padding: 0;
}

.support-item {
  margin-bottom: 8px;
}

.support-link {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  color: #555;
  text-decoration: none;
  transition: all 0.3s ease;
}

.support-link:hover {
  background: #f5f5f5;
  color: #333;
  transform: translateX(5px);
}

.support-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  display: inline-block;
}

.support-icon.help-center {
  background-image: url('https://img.lazcdn.com/g/tps/tfs/TB1nQJUcwmTBuNjy1XbXXaMrVXa-986-930.png');
  background-size: auto;
  background-repeat: no-repeat;
  background-position: -163px -713px;
}

.support-icon.order-payment {
  background-image: url('https://img.lazcdn.com/g/tps/tfs/TB1nQJUcwmTBuNjy1XbXXaMrVXa-986-930.png');
  background-size: auto;
  background-repeat: no-repeat;
  background-position: -133px -715px;
  height: 24px;
  width: 22px;
}

.support-icon.shipping-delivery {
  background-image: url('https://img.lazcdn.com/g/tps/tfs/TB1nQJUcwmTBuNjy1XbXXaMrVXa-986-930.png');
  background-size: auto;
  background-repeat: no-repeat;
  background-position: -105px -715px;
  height: 24px;
  width: 22px;
}

.support-icon.returns-refunds {
  background-image: url('https://img.lazcdn.com/g/tps/tfs/TB1nQJUcwmTBuNjy1XbXXaMrVXa-986-930.png');
  background-size: auto;
  background-repeat: no-repeat;
  background-position: -72px -713px;
  height: 24px;
  width: 22px;
}

/* Account Popup */
.account-content {
  min-width: 220px;
}

.account-list {
  list-style: none;
  padding: 0;
}

.account-item {
  margin-bottom: 5px;
}

.account-link {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  color: #555;
  text-decoration: none;
  transition: all 0.3s ease;
}

.account-link:hover {
  background: #f5f5f5;
  color: #333;
  transform: translateX(5px);
}

.account-icon {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  background: #ddd;
  border-radius: 50%;
  display: inline-block;
}

/* Tracking Popup */
.tracking-content {
  min-width: 300px;
}

.tracking-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.tracking-help-text {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}

.tracking-help-text a {
  color: #667eea;
  text-decoration: none;
}

.tracking-help-text a:hover {
  text-decoration: underline;
}

/* Hidden Elements */
.nav-item-hidden {
  display: none;
}

/* Text Limit */
.nav-item-text-limit {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Icons */
.icon {
  width: 16px;
  height: 16px;
  display: inline-block;
}

.arrow-icon::before {
  content: '→';
  font-size: 14px;
}

.apple-store {
  width: 80%;
  height: 100%;
  background: url('https://icon-library.com/images/app-store-vector-icon/app-store-vector-icon-7.jpg') no-repeat center;
  background-size: cover;
  border-radius: 6px;
}

.google-store {
  width: 80%;
  height: 100%;
  background: #fff;
  background: url('https://cdn.freebiesupply.com/logos/large/2x/google-play-download-android-app-logo-png-transparent.png') no-repeat center;
  background-size: cover;
  border-radius: 4px;
}

/* Slideshow container */
.slideshow-container {
  max-width: 1000px;
  position: relative;
  margin: auto;
}

/* Hide the images by default */
.mySlides {
  display: none;
}

/* Next & previous buttons */
.prev, .next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  margin-top: -22px;
  padding: 16px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
}

/* Position the "next button" to the right */
.next {
  right: 0;
  border-radius: 3px 0 0 3px;
}

/* On hover, add a black background color with a little bit see-through */
.prev:hover, .next:hover {
  background-color: rgba(0,0,0,0.8);
}

/* Caption text */
.text {
  color: #f2f2f2;
  font-size: 15px;
  padding: 8px 12px;
  position: absolute;
  bottom: 8px;
  width: 100%;
  text-align: center;
}

/* Number text (1/3 etc) */
.numbertext {
  color: #f2f2f2;
  font-size: 12px;
  padding: 8px 12px;
  position: absolute;
  top: 0;
}

/* The dots/bullets/indicators */
.dot {
  cursor: pointer;
  height: 15px;
  width: 15px;
  margin: 0 2px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.6s ease;
}

.active, .dot:hover {
  background-color: #717171;
}

/* Fading animation */
.fade {
  animation-name: fade;
  animation-duration: 1.5s;
}

@keyframes fade {
  from {opacity: .4}
  to {opacity: 1}
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-nav {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-item {
    padding: 0 10px;
    font-size: 12px;
  }
  
  .popup-container {
    min-width: 250px;
    right: -50px;
  }
}

/* ==========================================================================
   LAYOUT COMPONENTS
   ========================================================================== */

.container {
  max-width: 1320px;
  margin-inline: auto;
  padding-inline: 1rem;
}

/* ==========================================================================
   HEADER COMPONENTS
   ========================================================================== */

.header-top {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 2px solid #e2e8f0;
  padding: 0.125rem 0;
  position: relative;
  overflow: hidden;
}

.header-top::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #cbd5e1, transparent);
}

.header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

/* Contact Information */
.header__contact {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.header__contact span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  transition: color 0.2s ease;
}

.header__contact span:first-child::before {
  content: '📞';
  font-size: 1rem;
}

.header__contact span:last-child::before {
  content: '📍';
  font-size: 1rem;
}

.header__contact span:hover {
  color: #1e293b;
}

/* Alert News */
.header__alert-news {
  flex: 1;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  background: linear-gradient(90deg, #f1f5f9, #e2e8f0, #f1f5f9);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.header__alert-news::before {
  content: '🔥';
  margin-right: 0.5rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Login/Signup Action */
.header__top__action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  text-decoration: none;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
  position: relative;
  overflow: hidden;
}

.header__top__action::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.header__top__action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.header__top__action:hover::before {
  left: 100%;
}

.header__top__action::after {
  content: '→';
  margin-left: 0.25rem;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.header__top__action:hover::after {
  transform: translateX(2px);
}

/* Responsive Design for Header */
@media (max-width: 768px) {
  .header__container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header__contact {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .header__contact span:first-child {
    margin-right: 0;
  }
  
  .header__alert-news {
    order: -1;
    width: 100%;
    max-width: 400px;
  }
}

@media (max-width: 480px) {
  .header-top {
    padding: 0.75rem 0;
  }
  
  .header__contact span,
  .header__alert-news,
  .header__top__action {
    font-size: 0.8rem;
  }
}


/* ===== HEADER AND COMPONENTS ===== */



.slideshow-container {
  max-width: 1000px;
  min-width: 600px;
  width: 100%;
  margin: 2rem auto;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

/* Responsive breakpoints */


@media (max-width: 768px) {
  .slideshow-container {
    width: 98%;
    margin: 1rem auto;
  }
}

@media (max-width: 480px) {
  .slideshow-container {
    width: 100%;
    min-width: 620px;
    margin: 0.5rem auto;
    border-radius: 8px;
  }
}


.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 100px;
  width: 100%;
  background-color: #f7f7f7;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 100px;
  gap: 25rem;
  width: 100%;
  max-width: 1320px;
  margin-inline: auto;
  padding-inline: 1rem;
  
}

.content-wrapper {
  transition: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 1320px;
  margin-inline: auto;
  padding-inline: 1rem;
}



</style>