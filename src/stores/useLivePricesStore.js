import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLivePricesStore = defineStore('livePrices', () => {
  const prices    = ref({})
  const high24h   = ref({})
  const low24h    = ref({})
  const volume24h = ref({})
  const history   = ref({})   // for sparklines (last 30 prices)

  function setPrice(sym, val) {
    prices.value[sym] = val
    const buf = (history.value[sym] ||= [])
    buf.push(val)
    if (buf.length > 30) buf.shift()
  }
  const setHigh24h   = (s, v) => (high24h.value[s]   = v)
  const setLow24h    = (s, v) => (low24h.value[s]    = v)
  const setVolume24h = (s, v) => (volume24h.value[s] = v)

  return {
    prices, high24h, low24h, volume24h, history,
    setPrice, setHigh24h, setLow24h, setVolume24h
  }
})
