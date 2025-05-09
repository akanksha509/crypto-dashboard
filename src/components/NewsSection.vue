\<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const newsItems = ref([])

async function fetchCryptoNews () {
  try {
    const { data } = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        apiKey:   import.meta.env.VITE_NEWS_API_KEY,
        q:        'crypto',
        language: 'en',
        sortBy:   'publishedAt',
        pageSize: 20          // plenty of items for taller pages
      }
    })

    newsItems.value = data.articles.map(a => ({
      title:       a.title,
      description: a.description,
      image_url:   a.urlToImage,
      link:        a.url,
      pubDate: new Date(a.publishedAt).toLocaleString('en-US', {
        year:'numeric', month:'short', day:'2-digit',
        hour:'2-digit', minute:'2-digit'
      })
    }))
  } catch (e) {
    console.error('Error fetching news:', e)
  }
}

onMounted(fetchCryptoNews)

function openNews (url) { window.open(url, '_blank') }
</script>

<template>
  <!-- ❷ NO fixed height, NO overflow-y — it simply expands -->
  <div class="w-full bg-white rounded-lg shadow p-4 space-y-4">
    <div
      v-for="(n, i) in newsItems"
      :key="i"
      class="flex cursor-pointer hover:bg-sky-100 rounded p-4"
      @click="openNews(n.link)"
    >
      <!-- thumbnail -->
      <img
        v-if="n.image_url"
        :src="n.image_url"
        class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        alt="News thumbnail"
      />
      <!-- copy -->
      <div class="pl-4 flex flex-col">
        <h3 class="font-bold text-lg leading-snug">{{ n.title }}</h3>
        <p class="text-sm text-gray-600 line-clamp-3">{{ n.description }}</p>
        <span class="text-xs text-gray-500">{{ n.pubDate }}</span>
      </div>
    </div>
  </div>
</template>
