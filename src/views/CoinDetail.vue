<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute }  from 'vue-router'
import { useCoinStore } from '../stores/useCoinStore.js'
import NewsSection   from '../components/NewsSection.vue'

const isLoading = ref(true)
const error     = ref('')
const coinStore = useCoinStore()
const id        = useRoute().params.id

onMounted(async () => {
  try { await coinStore.loadCoin(id) }
  catch (e) { error.value = e.message }
  finally   { isLoading.value = false }
})

onUnmounted(() => coinStore.clearCoin())
</script>

<template>
  <div class="flex w-full min-h-screen px-4 py-6 space-x-6">

    <!-- left: coin details -->
    <article class="flex-1 bg-white rounded shadow p-6 overflow-x-auto">
      <div v-if="isLoading" class="text-center text-gray-500">Loading…</div>
      <div v-else-if="error"   class="text-center text-red-500">{{ error }}</div>
      <template v-else>
        <!-- … your existing details markup … -->
      </template>
    </article>

    <!-- right: news -->
    <aside class="w-88">
      <NewsSection />
    </aside>

  </div>
</template>

<style scoped>
/* prose blocks from the description should take full width */
.prose { max-width: none; }
</style>


