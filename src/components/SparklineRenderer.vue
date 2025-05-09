<template>
  <canvas ref="cnv" :width="width" :height="height"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useLivePricesStore } from '../stores/useLivePricesStore.js'

const props   = defineProps({ params: Object })
const cnv     = ref(null)
const width   = 100
const height  = 30
const store   = useLivePricesStore()

function draw(arr) {
  const ctx = cnv.value.getContext('2d')
  ctx.clearRect(0, 0, width, height)
  if (!arr.length) return
  const max = Math.max(...arr)
  const min = Math.min(...arr)
  const rng = max - min || 1
  ctx.beginPath()
  arr.forEach((v, i) => {
    const x = (i / (arr.length - 1)) * width
    const y = height - ((v - min) / rng) * height
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
  })
  ctx.strokeStyle = '#22c55e'
  ctx.lineWidth   = 1.5
  ctx.stroke()
}

onMounted(() => {
  const sym = props.params.data.symbol.toUpperCase()
  watch(
    () => store.history[sym] || [],
    draw,
    { immediate: true, deep: true }
  )
})
</script>

<style scoped>
canvas { display:block }
</style>
