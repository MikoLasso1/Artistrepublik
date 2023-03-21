<template>
  <div>
    <base-header type="gradient-success" class="bg-orders" />
    <div style="marginTop:10px" class="container-fluid pb-8">
      <order-totals />
      <br />
      <order-table-filter @filtered="onFiltered" />
      <order-table-card :orders="orders" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import OrderTotals from '@/components/Orders/OrderTotals'
import OrderTableCard from '@/components/Orders/OrderTable/OrderTableCard'
import OrderTableFilter from '@/components/Orders/OrderTable/OrderTableFilter'

export default {
  components: {
    OrderTotals,
    OrderTableCard,
    OrderTableFilter
  },
  metaInfo () {
    return {
      title: 'Orders'
    }
  },
  data: function () {
    return {
      orders: [],
      filters: ''
    }
  },
  mounted: async function () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      try {
        let {
          data: { data }
        } = await Vue.$http.get(
          `v1/order${this.filters !== '' ? `?${this.filters}` : ''}`
        )
        this.orders = data
      } catch (err) {
        console.error(err)
        this.$sentry.captureException(err)
      }
    },
    onFiltered: function (filters) {
      if (filters !== this.filters) {
        this.filters = filters
        this.fetchData()
      }
    }
  }
}
</script>

<style>
.bg-orders {
  padding-top: 25% !important;
}

@media screen and (min-width: 992px) {
  .bg-orders {
    padding-top: 7.5% !important;
  }
}
</style>
