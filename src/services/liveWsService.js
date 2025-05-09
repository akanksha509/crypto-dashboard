// Binance mini-ticker WebSocket feed  -------------------------------
import { useLivePricesStore } from '../stores/useLivePricesStore.js'

let socket = null           // keep only one socket alive

export function connectLiveFeed(symbols = ['BTC', 'ETH']) {
  if (socket) socket.close()          // close any previous connection

  const streams = symbols
    .map(s => s.toLowerCase() + 'usdt@miniTicker')
    .join('/')

  socket = new WebSocket(
    `wss://stream.binance.com:9443/stream?streams=${streams}`
  )

  const store = useLivePricesStore()

  socket.onopen = () =>
    console.log('Live feed connected ✅  (Binance mini-ticker)')

  socket.onmessage = ({ data }) => {
    const { stream, data: p } = JSON.parse(data)
    const sym = stream.split('@')[0].replace('usdt', '').toUpperCase()

    store.setPrice(sym,     +p.c)
    store.setHigh24h(sym,   +p.h)
    store.setLow24h(sym,    +p.l)
    store.setVolume24h(sym, +p.v)
  }

  socket.onclose = () => {
    console.warn('WS closed — reconnecting in 3 s…')
    setTimeout(() => connectLiveFeed(symbols), 3000)
  }
  socket.onerror = err => {
    console.error('WS error → reconnect', err)
    socket.close()
  }
}
