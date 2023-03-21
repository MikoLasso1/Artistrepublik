<template>
  <div class="w-100">
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
    <v-row>
      <v-col md="3" cols="6" class="payout-button">
        <v-btn color="success" @click="openPayoutModal">
          Payout
        </v-btn>
      </v-col>
    </v-row>
    <payout-modal ref="payoutModal" :payout-amount="payout_amount" :last-payout="last_payout" @payout="updatePayout" />
  </div>
</template>

<script>
import Vue from 'vue'
import PayoutModal from '@/components/AudioEngineering/PayoutModal'

export default {
  components: {
    PayoutModal
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
    try {
      let {
        data: {
          data
        }
      } = await Vue.$http.get('v1/audio-engineering/account/stats')
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
  methods: {
    updatePayout: function (amount) {
      this.payout_amount - amount
    },
    openPayoutModal: function () {
      this.$refs.payoutModal.open()
    }
  }
}
</script>

<style scoped>
.payout-button {
  margin-top: 10px;
  width: 100px;
  float: right;
}

.order-complete {
  background-image: linear-gradient(to right, #12C8EF, #1076EF);
  /*background: #12C8EF;*/
}

.orders-pending {
  background-color: rgb(96, 112, 228);
  background-image: linear-gradient(to right, rgb(96, 112, 228), rgb(128, 94, 228));
}

.total-orders {
  background-color: rgb(245, 56, 90);
  background-image: linear-gradient(to right, rgb(245, 56, 90), rgb(244, 88, 28));

}

.orders-pending {
  background-color: rgb(96, 112, 228);
  background-image: linear-gradient(to right, rgb(96, 112, 228), rgb(128, 94, 228));
}

.payout-amount {
  background-image: linear-gradient(to right, #12C8EF, #1076EF);
}

.orders-number {
  text-align: center;
  font-weight: bold;
  color: white;
}

.orders_box {
  height: 100px;
  border-radius: 10px;
}

.content-header {
  color: white;
  padding-top: 30px;
  text-align: center;
}

.column-divs {
  margin: 10px 0;
}
</style>
