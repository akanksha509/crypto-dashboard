<script setup>
import CoinGrid     from '../components/CoinGrid.vue'
import NewsSection  from '../components/NewsSection.vue'
</script>

<template>
  <!-- full height minus the navbar (≈ 4 rem) -->
  <div class="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
    <!-- ─── left column : live grid ─── -->
    <div class="lg:flex-1 min-h-0 overflow-auto p-4 bg-white">
      <CoinGrid />
    </div>

    <!-- ─── right column : news ─── -->
    <div class="lg:w-1/3 min-h-0 overflow-auto p-4 bg-gray-100 border-l">
      <NewsSection />
    </div>
  </div>
</template>

<style scoped>
/* nothing extra needed */
</style>

