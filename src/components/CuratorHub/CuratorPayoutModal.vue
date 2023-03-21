<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="headline">
        <h2 class="m-0">
          Curator Payout
        </h2>
        <v-spacer></v-spacer>
        <v-icon @click="openModal">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <div class="alert alert-danger" v-if="alert === 'CURATOR_ERR_NOT_FOUND'"><strong>Sorry</strong> You must be a manager for this service.</div>
        <div class="alert alert-info" v-if="alert === 'CURATOR_ERR_PAYPAL_NOT_SETUP'"><strong>Notice </strong> You must first setup your payout method to payout.</div>
        <div class="alert alert-danger" v-if="alert === 'CURATOR_ERR_NOT_TWO_WEEKS'"><strong>Sorry</strong> You must be a manager for at least 2 weeks until you can payout.</div>
        <div class="alert alert-danger" v-if="alert === 'CURATOR_ERR_MIN_PAYOUT'"><strong>Sorry</strong> You must have at least $20 before you can payout.</div>
        <div class="alert alert-danger" v-if="alert === 'CURATOR_PENDING_ORDERS'"><strong>Sorry</strong> You cannot have pending curator orders.</div>
        <div v-if="!paypal_setup" class="text-center">
          <p class="body-1">Please connect your paypal email address to your settings</p>
          <v-btn color="primary" to="/settings">Click here to setup Paypal Payouts</v-btn>
        </div>
        <div v-else-if="payoutAmount < 20" class="text-center">
          <p class="body-1">A $20 minimum payout is required!</p>
        </div>
        <div v-else>
          <div class="text-center">
            <table class="payoutTable">
              <tr>
                <td>
                  <h4>Current Payout Balance</h4>
                </td>
                <td>
                  <h4 class="h4">${{ payoutAmount }}</h4>
                </td>
              </tr>
              <tr>
                <td>
                  <h4>PayPal Fee</h4>
                </td>
                <td>
                  <h4 class="h4">${{ ((.029 * payoutAmount) + .30).toFixed(2) }}</h4>
                </td>
              </tr>
              <tr>
                <td>
                  <h4>You'll Receive</h4>
                </td>
                <td>
                  <h4 class="h4">${{ (payoutAmount - ((.029 * payoutAmount) + .30)).toFixed(2) }}</h4>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </v-card-text>
      <v-card-text>
        <div class="alert alert-danger" v-if="disabled && !alert">Please wait a few minutes before attempting another payout.</div>
      </v-card-text>
      <v-card-actions v-if="paypal_setup && payoutAmount >= 20">
        <v-spacer></v-spacer>
        <v-btn ref="payout" text color="primary" @click="doPayout" :disabled="disabled">Payout</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    payoutAmount: {
      type: [String, Number]
    },
    lastPayout: {
      type: [String, null]
    }
  },
  data: function () {
    return {
      paying: false,
      paypal_setup: false,
      amount: this.payoutAmount,
      payoutSucceeded: false,
      alert: '',
      dialog: false,
      disabled: false,
      clicked: false
    }
  },
  created: async function () {
    try {
      let { account: { payments } } = await this.$store.dispatch('fetchSettings')
      if (payments.paypal_enabled) {
        this.paypal_setup = true
      }
    } catch (err) {
      console.error(err)
      this.$sentry.captureException(err)
    }
  },
  methods: {
    doPayout: async function () {
      this.clicked = true
      try {
        this.paying = true
        let { data: { data } } = await Vue.$http.post('v1/service/playlist-republik/payment/payout')

        if (!data.success) {
          this.alert = data.error
        } else {
          this.alert = '<strong>Success!</strong> Your payout of $'
            + this.amount
            + ' has been completed.'
          this.payoutSucceeded = true
          this.$emit('payout', this.amount)
        }
      } catch (err) {
        console.error(err)
        this.$sentry.captureException(err)
      }
      this.paying = false
    },
    openModal () {
      this.dialog = !this.dialog
    },
    within5Minutes () {
      let date1 = new Date(this.lastPayout),
        date2 = new Date(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''))

      let diff = Math.abs(date2 - date1) / 60000


      if (diff < 5 || this.clicked) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    }
  },
  updated: function () {
    this.within5Minutes()
  },
  watch: {
    clicked: function () {
      this.disabled = true
    }
  }
}
</script>

<style lang="scss" scoped>
.normal-btn {
  color: white;
  background-color: #5e72e4 !important;
  font-family: 'Open Sans' !important;
  text-transform: none;
  letter-spacing: normal;
}

table.payoutTable {
  width: 70%;
  margin: 15px auto 0 auto;
}

table.payoutTable td {
  padding: 15px;
  text-align: left;
}
</style>
