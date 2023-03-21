<template>
  <div>
    <v-data-table
      :headers="headers"
      :loading="loading"
      :items="orders"
    >
      <template #item.uuid="{ item }">
        {{ item.uuid.substr(0, 10) }}...&nbsp;
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              mdi-dots-horizontal
            </v-icon>
          </template>
          <span>{{ item.uuid }}</span>
        </v-tooltip>
      </template>
      <template #item.type="{ item }">
        {{ item.type === `beat` ? `Beat` : `Sample/Pack` }}
      </template>
      <template #item.amount="{ item }">
        ${{ item.amount }}
      </template>
      <template #item.fee="{ item }">
        ${{ item.fee }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn v-if="item.type === `beat`" color="primary" @click="viewContract(item.uuid)">View Contract</v-btn>
        <v-btn v-if="item.type === `sample`" color="primary" @click="viewSamples(item.uuid)">View Samples</v-btn>
      </template>
    </v-data-table>
    <order-samples-modal ref="orderSamplesModal" />
  </div>
</template>

<script>
import Vue from 'vue'
import OrderSamplesModal from '@/components/SoundStore/Manager/OrderSamplesModal'

export default {
  components: {
    OrderSamplesModal
  },
  data: function () {
    return {
      loading: false,
      type: null,
      orders: [],
      headers: [
        { text: 'ID', value: 'uuid', width: '20%' },
        { text: 'Type', value: 'type' },
        { text: 'Name', value: 'name' },
        { text: 'Price', value: 'amount' },
        { text: 'Fee', value: 'fee' },
        { text: 'Downloads', value: 'download_times', align: 'center' },
        { text: 'Actions', value: 'actions', align: 'center' }
      ]
    }
  },
  methods: {
    getOrders: async function () {
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.get(`v1/sound-store/order${this.type ? `?type=${this.type}` : ``}`)
        this.orders = data
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    },
    viewContract: async function (uuid) {
      try {
        let { data: { data } } = await Vue.$http.get(`v1/sound-store/order/contract/${uuid}`)
        window.open(data.url, '_blank')
      } catch (err) {
        this.throwError(err)
      }
    },
    viewSamples: function (uuid) {
      this.$refs.orderSamplesModal.openModal(uuid)
    }
  },
  created: function () {
    this.getOrders()
  }
}
</script>

<style>

</style>
