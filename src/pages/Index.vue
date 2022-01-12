
<template>
  <div class="q-pa-md q-gutter-sm" v-if="synced == false">
    <q-banner inline-actions rounded class="text-white">
      <q-icon name="warning" class="text-red" style="font-size: 1.2rem;" />
      indexing in progress, data is not 100% accurate.
    </q-banner>
  </div>
  <q-page :class="$q.screen.gt.sm ? 'q-pa-xl': 'q-pa-sm'">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <h4 class="text-subtitle1 q-ma-none">TVL</h4>
            <p class="text-h5 q-my-md text-center">{{ numeral(tvl_usd).format("0,0 $") }}</p>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <h4 class="text-subtitle1 q-ma-none">24h Volume</h4>
            <p class="text-h5 q-my-md text-center">{{ numeral(vol24h_usd).format("0,0 $") }}</p>
          </q-card-section>
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

                <span v-if="props.row.name.includes('[aquafarm]')" class="text-h6">
                  🌊<q-tooltip>aquafarm</q-tooltip>
                </span>
                <span v-if="props.row.name.includes('[stable]')" class="text-h6">
                  ⚖️<q-tooltip>stable</q-tooltip>
                </span>
              </router-link>
            </q-td>
            <q-td key="tvl" :props="props">
              {{ numeral(props.row.tvl).format("0,0 $") }}
            </q-td>
            <q-td key="vol24h" :props="props">
              {{ numeral(props.row.vol24h).format("0,0 $") }}
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

import poolquery from '../queries/pools.gql'
import statequery from '../queries/state.gql'
import { client } from '../services/graphql'
import { get_token } from '../services/tokens'
import numeral from "numeral"
import moment from "moment"

export default defineComponent({
  name: 'IndexPage',
  computed: {
    displayed_pools() {
      return this.pools.map((pool) => ({
        ...pool,
        coin: get_token(pool.coin.address, pool.coin),
        pc: get_token(pool.pc.address, pool.pc),
        tvl: pool.stats.tvl_usd,
        vol24h: pool.stats.vol24h_usd,
      })).sort((a, b) => (
        a.tvl < b.tvl
      ))
    },
    vol24h_usd() {
      return this.pools.reduce((v0, v1) => (v0 + v1.stats.vol24h_usd), 0)
    },
    tvl_usd() {
      return this.pools.reduce((v0, v1) => (v0 + v1.stats.tvl_usd), 0)
    }
  },
  async setup() {
    let state = await client.request(statequery);
    let synced = true;
    let timeDiff = (+new Date()/1000) - state.status.last_blockTime;
    if(state.status.state !== "OK" || timeDiff > 600) {
      synced = false
    }

    let result = await client.request(poolquery)
    console.log(result)

    return {
      synced: synced,
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
