<template>
  <div>
    <div class="pressrelease-stats my--2">
      <v-row>
        <v-spacer />
        <v-col cols="6" xl="2">
          <StatsCard
            title="Status"
            color="#7f2450"
            :stat="uppercase(status)"
            icon="mdi-flare"
            class="mb-4 mb-xl-0"
          />
        </v-col>
        <v-col cols="6" xl="2">
          <StatsCard
            title="Completed"
            color="#ee378e"
            :stat="orders_completed"
            icon="mdi-check-all"
            class="mb-4 mb-xl-0"
          />
        </v-col>
        <v-col cols="6" xl="2">
          <StatsCard
            title="Pending"
            color="#3F51B5"
            :stat="orders_pending"
            icon="mdi-timer-sand-full"
            class="mb-4 mb-xl-0"
          />
        </v-col>
        <v-col cols="6" xl="2">
          <StatsCard
            title="Total Orders"
            color="#0f1d3a"
            :stat="total_orders"
            icon="mdi-account-multiple"
            class="mb-4 mb-xl-0"
          />
        </v-col>
        <v-col cols="6" xl="2">
          <StatsCard
            title="Payout"
            color="#69F0AE"
            :stat="payout_amount"
            icon="mdi-currency-usd"
            class="mb-4 mb-xl-0"
          />
        </v-col>
        <v-spacer />
      </v-row>
      <div class="mb-2 mt-3">
        <payout-modal :payout-amount="payout_amount" :last-payout="last_payout" type="press-release-manager" ref="payoutModal"></payout-modal>
        <div class="payout-button">
          <v-btn color="success" @click="showPayoutModal">Payout</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import PayoutModal from '@/components/PayoutModal'
import StatsCard from '@/components/StatsCard'

export default {
  components: {
    PayoutModal,
    StatsCard
  },
  data: function () {
    return {
      status: 'pending',
      orders_completed: 0,
      orders_pending: 0,
      total_orders: 0,
      payout_amount: 0,
      last_payout: ''
    }
  },
  methods: {
    showPayoutModal: function () {
      this.$refs.payoutModal.openModal()
    }
  },
  created: async function () {
    try {
      let {
        data: { data }
      } = await Vue.$http.get('v1/press-release/stats')
      this.status = data.status
      this.orders_completed = data.orders_completed
      this.orders_pending = data.orders_pending
      this.total_orders = data.total_orders
      this.payout_amount = data.payout_amount
      this.last_payout = data.last_payout
    } catch (err) {
      console.error(err)
      this.$sentry.captureException(err)
    }
  }
}
</script>
<style scoped>
.payout-button {
  margin-top: 10px;
  float: right;
}
</style>
