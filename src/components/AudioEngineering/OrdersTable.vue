<template>
  <v-card flat class="w-100" style="min-height: 300px;">
    <v-tabs v-model="tab">
      <v-tab>Pending</v-tab>
      <v-tab>In Queue</v-tab>
      <v-tab>Started</v-tab>
      <v-tab>Completed</v-tab>
    </v-tabs>
    <v-card-text>
      <v-data-table :headers="headers" :items="data" :loading="loading" :expanded.sync="expanded" show-expand>
        <template #item.amount="{ item }">
          {{ item.amount | centsToDollar }}
        </template>
        <template #item.similar_song="{ item }">
          <a :href="`${item.similar_song ? item.similar_song : '#'}`" target="_blank">{{ item.similar_song ? item.similar_song : '-' }}</a>
        </template>
        <template #item.status="{ item }">
          <span>{{ uppercase(item.status) }}</span>
        </template>
        <template #item.created_at="{ item }">
          {{ item.created_at | formatDateTime }}
        </template>
        <template #item.actions="{ item }">
          <order-status-actions @status-changed="fetchData" :order="item" />
        </template>
        <template #expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pa-4">
            <order-table-details :order="item" />
          </td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'
import OrderStatusActions from '@/components/AudioEngineering/OrdersTable/OrderStatusActions'
import OrderTableDetails from '@/components/AudioEngineering/OrdersTable/OrderTableDetails'

export default {
  components: {
    OrderStatusActions,
    OrderTableDetails
  },
  data: function () {
    return {
      tab: null,
      loading: false,
      expanded: [],
      headers: [{
        text: 'Service',
        value: 'service.title'
      }, {
        text: 'Revision',
        value: 'revision'
      }, {
        text: 'Amount',
        value: 'amount'
      },
        {
          text: 'Similar Song',
          value: 'similar_song'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: 'Ordered On',
          value: 'created_at'
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false
        },
        {
          text: '',
          value: 'data-table-expand'
        }
      ],
      data: [],
      selectedOrder: null
    }
  },
  computed: {
    tabStatus: function () {
      switch (this.tab) {
        case 0:
          return 'pending'
        case 1:
          return 'processing'
        case 2:
          return 'started'
        case 3:
          return 'completed'
      }
      return ''
    }
  },
  watch: {
    tab: function () {
      this.data = []
      this.fetchData()
    }
  },
  methods: {
    fetchData: async function () {
      this.loading = true
      try {
        let {
          data: {
            data
          }
        } = await Vue.$http.get(`v1/audio-engineering/orders?status=${this.tabStatus}`)
        this.data = data
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    }
  },
  mounted: function () {
    this.fetchData()
  }
}
</script>

<style>

</style>
