<template>
  <div>
    <div class="CuratorStats mt--4 mb-4">
      <v-row>
        <v-col cols="6" xl="3">
          <StatsCard
            title="Completed"
            color="#ee378e"
            :stat="orders_completed"
            icon="mdi-check-all"
            class="mb-4 mb-xl-0"
          />
        </v-col>
        <v-col cols="6" xl="3">
          <StatsCard
            title="Pending"
            color="#3F51B5"
            :stat="orders_pending"
            icon="mdi-timer-sand-full"
            class="mb-4 mb-xl-0"
          />
        </v-col>
        <v-col cols="6" xl="3">
          <StatsCard
            title="Total Orders"
            color="#0f1d3a"
            :stat="total_orders"
            icon="mdi-account-multiple"
            class="mb-4 mb-xl-0"
          />
        </v-col>
        <v-col cols="6" xl="3">
          <StatsCard
            title="Payout"
            color="#69F0AE"
            :stat="payout_amount"
            icon="mdi-currency-usd"
            class="mb-4 mb-xl-0"
          />
        </v-col>
      </v-row>
    </div>
    <CuratorPayoutModal
      :payout-amount="payout_amount"
      :last-payout="last_payout"
      ref="CuratorPayoutModal"
      @payout="payoutSucceeded"
    />
    <div class="payout-button">
      <v-btn
        color="success"
        @click="showPayoutModal"
      >
        Payout
      </v-btn>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import CuratorPayoutModal from '@/components/CuratorHub/CuratorPayoutModal'

export default {
  components: {
    CuratorPayoutModal
  },
  data: function () {
    return {
      orders_completed: 0,
      orders_pending: 0,
      total_orders: 0,
      payout_amount: 0,
      last_payout: ''
    }
  },

  created: async function () {
    await this.getCuratorStats()
  },

  methods: {
    getCuratorStats: async function () {
      try {
        let { data: { data } } = await Vue.$http.get('v1/service/playlist-republik/curator/stats')
        this.orders_completed = data.orders_completed
        this.orders_pending = data.orders_pending
        this.total_orders = data.total_orders
        this.payout_amount = data.payout_amount
        this.last_payout = data.last_payout
      } catch (err) {
        console.error(err)
        this.$sentry.captureException(err)
      }
    },

    payoutSucceeded: function () {
      this.getCuratorStats()
    },

    showPayoutModal: function () {
      this.$refs.CuratorPayoutModal.openModal()
    }
  }
}
</script>
<style scoped>
.payout-button {
  text-align: center;
  margin-top: 10px;
  width: 100px;
  float: right;
}
</style>
