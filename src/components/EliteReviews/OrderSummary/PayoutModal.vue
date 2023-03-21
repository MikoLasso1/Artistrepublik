<template>
  <v-dialog v-model="dialog" max-width="600">
    <loading-overlay :loading="paying || loading" />
    <v-card class="w-100" flat>
      <v-card-title class="headline">
        <v-row no-gutters align="center" class="w-100">
          <v-col cols="12">
            <h2 class="text-uppercase text-muted ls-1 mb-1 h6">
              Elite Reviews Payout
            </h2>
          </v-col>
        </v-row>
      </v-card-title>
      <v-row class="px-6 pb-4">
        <v-card flat outline class="w-100">
          <div class="card-body">
            <div v-show="loading" class="text-center">
              Loading...
            </div>
            <div v-if="alert === 'ERR_NOT_TWO_WEEKS'" class="alert alert-danger">
              <strong>Sorry</strong> You must have an elite review account for at least 2 weeks until you can payout.
            </div>
            <div v-if="alert === 'ERR_NO_ACCOUNT'" class="alert alert-danger">
              <strong>Sorry</strong> You must be an elite reviewer to payout.
            </div>
            <div v-if="alert === 'PAYPAL_NOT_SETUP'" class="alert alert-info">
              <strong>Notice </strong> You must first setup your payout method to payout.
            </div>
            <div v-if="alert === 'ERR_MIN_PAYOUT'" class="alert alert-danger">
              <strong>Sorry</strong> You must have at least $100 before you can payout.
            </div>
            <div v-if="alert === 'PENDING_ORDERS'" class="alert alert-info">
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
              <v-alert v-if="success" dismissible type="success" dark>{{ success }}</v-alert>
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
        </v-card>
      </v-row>
      <v-card-text>
        <div class="alert alert-danger" v-if="disabled">Please wait a few minutes before attempting another payout.</div>
      </v-card-text>
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
import config from '@/config'
import LoadingOverlay from '@/components/LoadingOverlay'

export default {
  components: {
    LoadingOverlay
  },
  props: {
    settings: Object,
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
      amount: this.payoutAmount,
      alert: null,
      success: null,
      disabled: false,
      clicked: false
    }
  },
  computed: {
    paypalSetup: function () {
      return this.settings && (this.settings.paypal_email !== null || this.settings.paypal_email !== undefined)
    }
  },
  watch: {
    payoutAmount: function () {
      this.alert = null
    },
    clicked: function () {
      this.disabled = true
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
        } = await Vue.$http.post(config.REVIEW_REPUBLIK_API_URL + '/api/v1/reviewers/' + this.settings.uuid + '/payout', {
          amount: this.amount
        })
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
