<template>
  <v-dialog v-model="dialog" max-width="600">
    <loading-overlay :loading="paying || loading" />
    <v-card class="w-100" flat>
      <v-card-title class="headline">
        <v-row no-gutters align="center" class="w-100">
          <v-col cols="12">
            <h6 class="text-uppercase text-muted ls-1 mb-1">
              Audio Engineering Services Payout
            </h6>
          </v-col>
        </v-row>
      </v-card-title>
      <v-row class="px-6 pb-4">
        <v-card flat outline class="w-100">
          <div class="card-body">
            <div v-show="loading" class="text-center">
              Loading...
            </div>
            <div v-if="alert === 'AE_ERR_NOT_TWO_WEEKS'" class="alert alert-danger">
              <strong>Sorry</strong> You must have an audio engineer account for at least 2 weeks until you can payout.
            </div>
            <div v-if="alert === 'AE_ERR_NOT_ENGINEER'" class="alert alert-danger">
              <strong>Sorry</strong> You must be a audio engineer to payout.
            </div>
            <div v-if="alert === 'AE_PAYPAL_NOT_SETUP'" class="alert alert-info">
              <strong>Notice </strong> You must first setup your payout method to payout.
            </div>
            <div v-if="alert === 'AE_ERR_MIN_PAYOUT'" class="alert alert-danger">
              <strong>Sorry</strong> You must have at least $100 before you can payout.
            </div>
            <div v-if="alert === 'AE_PENDING_ORDERS'" class="alert alert-info">
              <strong>Sorry</strong> You must have no pending orders to pay out. <strong> Please try again.</strong>
            </div>
            <div v-if="!paypalSetup && !loading" class="text-center">
              <p>Please connect your paypal email address to your settings</p>
              <router-link to="/settings">
                <v-btn class="normal-btn">
                  Click here to setup Paypal
                </v-btn>
              </router-link>
            </div>
            <div v-else-if="payoutAmount < 100" class="text-center">
              <p>A $100 minimum payout is required!</p>
            </div>
            <div v-else class="text-center">
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
            <v-card-text>
              <div class="alert alert-danger" v-if="disabled">Please wait a few minutes before attempting another payout.</div>
            </v-card-text>
          </div>
        </v-card>
      </v-row>
      <v-card-actions>
        <v-btn class="normal-btn" :loading="paying" :disabled="disabled" @click="payout">
          Payout
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import LoadingOverlay from '@/components/LoadingOverlay'

export default {
  components: {
    LoadingOverlay
  },
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
      loading: false,
      dialog: false,
      paying: false,
      paypalSetup: false,
      amount: this.payoutAmount,
      alert: null,
      disabled: false,
      clicked: false
    }
  },
  created: async function () {
    try {
      this.loading = true
      let {
        account: {
          payments
        }
      } = await this.$store.dispatch('fetchSettings')
      if (payments.paypal_enabled) {
        this.paypalSetup = true
      }
      this.loading = false
    } catch (err) {
      console.error(err)
      this.loading = false
      this.$sentry.captureException(err)
    }
  },
  methods: {
    payout: async function () {
      this.clicked = true
      try {
        this.paying = true
        let {
          data: {
            data
          }
        } = await Vue.$http.post('v1/audio-engineering/account/payout')
        if (!data.success) {
          this.alert = data.error
        } else {
          this.alert = 'Successfully processed payout!'
          this.$emit('payout', this.amount)
        }
        this.paying = false
      } catch (err) {
        console.error(err)
        this.paying = false
        this.$sentry.captureException(err)
      }
    },
    open: function () {
      this.dialog = true
    },
    close: function () {
      this.dialog = false
      this.$emit('close')
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
  font-family: 'Open Sans';
  text-transform: none;
  letter-spacing: normal;
}

.card {
  border: none;
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
