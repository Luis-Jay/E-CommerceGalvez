<template>
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