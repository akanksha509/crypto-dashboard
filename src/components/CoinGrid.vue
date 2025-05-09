<template>
  <ag-grid-vue
    class="ag-theme-quartz"
    style="width:100%;height:100%"
    domLayout="autoHeight"
    :rowData="coinsStore.coins"
    :columnDefs="colDefs"
    :getRowId="p => p.data.symbol.toUpperCase()"
    @grid-ready="onGridReady"
    allowDragFromColumnsToolPanel

    :pagination="true"
    :paginationPageSize="10"
    :paginationPageSizeSelector="[10,25,50,100]"
    @paginationChanged="onPaginationOrSizeChanged"
    @sortChanged="onSortChanged"
  />
</template>

<script setup>
import { ref, watch }           from 'vue'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridVue }            from 'ag-grid-vue3'

import { useCoinsStore }        from '../stores/useCoinsStore.js'
import { useLivePricesStore }   from '../stores/useLivePricesStore.js'
import { connectLiveFeed }      from '../services/liveWsService.js'

import CoinCellRenderer         from './cell-renderers/CoinCellRenderer.vue'
import SparklineRenderer        from './SparklineRenderer.vue'

/* ------------------------------------------------------------------ */
/*  column definitions                                                */
/* ------------------------------------------------------------------ */
const fmt = v => v==null ? '' :
  new Intl.NumberFormat('en-US',{ maximumFractionDigits:2 }).format(v)

const colDefs = ref([
  { headerName:'Coin',  field:'coin',          cellRenderer:CoinCellRenderer, minWidth:180, flex:2 },
  { headerName:'Price', field:'current_price', valueFormatter:p=>fmt(p.value), type:'rightAligned', flex:1 },
  { headerName:'High 24h', field:'high_24h',   valueFormatter:p=>fmt(p.value), type:'rightAligned', flex:1 },
  { headerName:'Low 24h',  field:'low_24h',    valueFormatter:p=>fmt(p.value), type:'rightAligned', flex:1 },
  { headerName:'Total Vol',field:'total_volume',valueFormatter:p=>fmt(p.value),type:'rightAligned', flex:1 },
  { headerName:'Sparkline',           cellRenderer:SparklineRenderer,         minWidth:120, flex:1 }
])

/* ------------------------------------------------------------------ */
/*  grid + data                                                       */
/* ------------------------------------------------------------------ */
const coinsStore = useCoinsStore()
const liveStore  = useLivePricesStore()

let gridApi = null
function onGridReady(p) { gridApi = p.api; p.api.sizeColumnsToFit() }

coinsStore.loadCoins()                       // initial HTTP page 1

/* ------------  Web-Socket subscription management  ---------------- */

let subscribed = new Set()

function ensureFeedForVisibleRows () {
  if (!gridApi) return
  const visibleNodes = []
  gridApi.forEachNodeAfterFilterAndSort(n => visibleNodes.push(n))

  const wantedSyms = visibleNodes.map(n => n.data.symbol.toUpperCase())
  const newbies    = wantedSyms.filter(s => !subscribed.has(s))
  if (!newbies.length) return

  newbies.forEach(s => subscribed.add(s))
  connectLiveFeed([...subscribed])           // reconnect with the superset
}

/* call ensureFeed… whenever:  */
watch(() => coinsStore.coins, ensureFeedForVisibleRows, { immediate:true })
function onPaginationOrSizeChanged() { ensureFeedForVisibleRows() }

/* ------------  patch live fields on every tick  ------------------- */
const patch = (map, field) => {
  if(!gridApi) return
  Object.entries(map).forEach(([s,v])=>{
    const n = gridApi.getRowNode(s)
    if(n) n.setDataValue(field, v)
  })
}
watch(() => liveStore.prices,    m=>patch(m,'current_price'), {deep:true})
watch(() => liveStore.high24h,   m=>patch(m,'high_24h'),      {deep:true})
watch(() => liveStore.low24h,    m=>patch(m,'low_24h'),       {deep:true})
watch(() => liveStore.volume24h, m=>patch(m,'total_volume'),  {deep:true})

/* ------------  sort + server-side pagination (kept)  -------------- */
const onSortChanged = e => {
  const m = e.columns.map(c=>({colId:c.colId,sort:c.sort}))
  if(m.length) coinsStore.updateSort(m[0].colId,m[0].sort)
}
function onPaginationChanged(){}      // not needed anymore (replaced)
</script>

<style scoped>
.ag-theme-quartz{box-shadow:9px 1px 15px -4px rgba(0,0,0,.1)}
.ag-cell,.ag-header-cell{padding-inline:4px!important}
</style>

