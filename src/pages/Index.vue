<template>
  <div class="q-pa-md q-gutter-sm" v-if="synced == false">
    <q-banner inline-actions rounded class="text-white">
      <q-icon name="warning" class="text-red" style="font-size: 1.2rem;" />
      indexing in progress, data is not 100% accurate.
    </q-banner>
  </div>
  <q-page :class="$q.screen.gt.sm ? 'q-pa-xl': 'q-pa-sm'">

    <div class="row q-col-gutter-md items-stretch q-mb-md">
      <div class="col-xs-12 col-md-2">
        <div class="row-sm column-md q-col-gutter-md items-stretch">
          <div class="col full-height">
            <stat-box :value="tvl_usd" label="TVL" decimals="0" />
          </div>
          <div class="col full-height">
            <stat-box :value="vol24h_usd" label="Volume (24h)" decimals="0" />
          </div>
          <div class="col full-height">
            <stat-box :value="vol7d_usd" label="Volume (7d)" decimals="0" />
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md">
        <q-card>
          <template v-if="aggregatedStats">
            <q-card-section>
              <div class="text-subtitle1">Total value locked (all markets)</div>
            </q-card-section>
            <q-separator dark inset />
            <q-card-section>
              <global-tvl-chart :tvl="stats.globalTvl" />
            </q-card-section>
          </template>
          <overlay-spinner v-else height="288px" />
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-6 col-md">
        <q-card class="full-height">
          <template v-if="aggregatedStats">
            <q-card-section>
              <div class="text-subtitle1">
                Total traded volume (all markets)
              </div>
            </q-card-section>
            <q-separator dark inset />
            <q-card-section>
              <global-volume-chart :volume="stats.globalVolume" />
            </q-card-section>
          </template>
          <overlay-spinner v-else height="288px" />
        </q-card>
      </div> 

      
    </div>

    <div class="bg-dark rounded-borders q-pa-one">
      <q-table
        title="Pools 🐳"
        :rows="displayed_pools"
        :columns="poolcols"
        row-key="name"
        :pagination="{
          rowsPerPage: 25,
          sortBy: 'tvl',
          descending: true
        }"
        class=""
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props" class="text-white">
              <router-link :to="{ name: 'pool', params: { address: props.row.ammId }}"  class="text-white text-bold">
              <q-avatar size="xs">
                <img :src="props.row.coin.logoURI">
              </q-avatar>
              <q-avatar size="xs">
                <img :src="props.row.pc.logoURI">
              </q-avatar>
                {{ props.row.coin.symbol }}-{{ props.row.pc.symbol }}
              </router-link>
            </q-td>
            <q-td key="price" :props="props">
              {{ numeral(props.row.price).format("0,0.[000]") }}
            </q-td>
            <q-td key="price_usd" :props="props">
              {{ numeral(props.row.price_usd).format("0,0.[000] $") }}
            </q-td>
            <q-td key="change_1h" :props="props">
              <price-change :change="props.row.change_1h" />
            </q-td>
            <q-td key="change_24h" :props="props">
              <price-change :change="props.row.change_24h" />
            </q-td>
            <q-td key="change_7d" :props="props">
              <price-change :change="props.row.change_7d" />
            </q-td>
            <q-td key="tvl" :props="props">
              {{ numeral(props.row.tvl).format("0,0 $") }}
            </q-td>
            <q-td key="vol24h" :props="props">
              {{ numeral(props.row.vol24h).format("0,0 $") }}<br>
              <price-change :change="props.row.change_vol24h" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
  import { defineComponent, ref } from 'vue'

import poolquery from '../queries/pools.gql'
import poolStatsQuery from "../queries/pool_stats.gql"
import statequery from '../queries/state.gql'
import { client } from '../services/graphql'
import { get_token } from '../services/tokens'
import PriceChange from "../components/PriceChange.vue";
import numeral from "numeral"
import moment from "moment"
import StatBox from "./Index/StatBox.vue";
import GlobalVolumeChart from "src/components/GlobalVolumeChart.vue";
import GlobalTvlChart from "src/components/GlobalTvlChart.vue";
import OverlaySpinner from "src/components/OverlaySpinner.vue";

export default defineComponent({
  name: 'IndexPage',
  components: {
    PriceChange,
    StatBox,
    GlobalVolumeChart,
    GlobalTvlChart,
    OverlaySpinner
  },
  computed: {
    displayed_pools() {
      return this.pools.map((pool) => ({
        ...pool,
        coin: get_token(pool.coin.address, pool.coin),
        pc: get_token(pool.pc.address, pool.pc),
        tvl: pool.stats.tvl_usd,
        vol24h: pool.stats.vol24h_usd,
        price: pool.stats.price,
        price_usd: pool.stats.price_usd/pool.stats.price,
        change_1h: 0-(pool.stats.change_1h),
        change_24h: 0-(pool.stats.change_24h),
        change_7d: 0-(pool.stats.change_7d),
        change_vol24h: pool.stats.change_vol24h,
      })).sort((a, b) => (
        a.tvl < b.tvl
      ))
    },
    vol24h_usd() {
      return this.pools.reduce((v0, v1) => (v0 + v1.stats.vol24h_usd), 0)
    },
    vol7d_usd() {
      return this.pools.reduce((v0, v1) => (v0 + v1.stats.vol7d_usd), 0)
    },
    tvl_usd() {
      return this.pools.reduce((v0, v1) => (v0 + v1.stats.tvl_usd), 0)
    },
  },
  async setup() {
    let state = await client.request(statequery);
    let synced = true;
    let timeDiff = (+new Date()/1000) - state.status.last_blockTime;
    if(state.status.state !== "OK" || timeDiff > 600) {
      synced = false
    }

    let result = await client.request(poolquery)
    //console.log(result)
    const aggregatedStats = ref(false)
    const stats = ref({globalTvl: {}, globalVolume:[]})
    client.request(poolStatsQuery).then((data) => {
      stats.value.globalTvl = []
      stats.value.globalVolume = []
      for(const stat of data.aggregated_pools_stats) {
        stats.value.globalTvl.push({interval: stat.time+'/'+stat.time, tvlUsd: stat.tvl_usd})
        stats.value.globalVolume.push({interval: stat.time+'/'+stat.time, volumeUsd: stat.volume_usd})
      }
      aggregatedStats.value = true
    })

    return {
      synced: synced,
      aggregatedStats: aggregatedStats,
      stats: stats,
      pools: result.pools,
      poolcols: [
        {
          name: 'name',
          label: 'Pool name',
          field: 'name',
          align: 'left',
          sortable: true
        },
        {
          'name': 'price',
          'label': 'Price (STEP)',
          'field': 'price',
          sortable: true
        },
        {
          'name': 'price_usd',
          'label': 'Price ($)',
          'field': 'price_usd',
          sortable: true
        },
        {
          'name': 'change_1h',
          'label': '1h %',
          'field': 'change_1h',
          sortable: true
        },
        {
          'name': 'change_24h',
          'label': '24h %',
          'field': 'change_24h',
          sortable: true
        },
        {
          'name': 'change_7d',
          'label': '7d %',
          'field': 'change_7d',
          sortable: true
        },
        {
          'name': 'tvl',
          'label': 'TVL',
          'field': 'tvl',
          sortable: true
        },
        {
          'name': 'vol24h',
          'label': 'Volume (24h)',
          'field': 'vol24h',
          sortable: true
        }
      ],
      numeral: numeral
    }
  }

})
</script>
<style lang="css">
.apexcharts-text {
  fill: #aaa;
}
.apexcharts-tooltip-y-group {
  color: #000 !important;
}
.apexcharts-tooltip-title {
  color: #000 !important;
}
.apexcharts-menu {
  color: #000 !important;
}
</style>
