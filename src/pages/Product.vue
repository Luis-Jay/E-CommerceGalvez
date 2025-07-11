<template>
<AppHeader />

<div class="container">
    <div class="single-product">
        <div class="col-6">
            <div class="product-image">
                <img src="https://img.lazcdn.com/g/p/d3e71f03e916682274322be6e171dfa4.png_400x400q80.png_.avif" alt="Product Image">
                <div class="product-image-thumbnails">
                    <img src="#" alt=""  class="image-list">
                    <img src="#" alt=""  class="image-list">
                    <img src="#" alt=""  class="image-list">
                    <img src="#" alt=""  class="image-list">
                </div>
            </div>
        </div>

        <div class="col-6">
            <div class="breadcrumb">
                <span>Home</span>
                <span>Product</span>
                <span>Product Name</span>
            </div>
        </div>



    </div>
</div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>



<style scoped>

</style>