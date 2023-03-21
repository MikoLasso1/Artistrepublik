<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="headline">
        Payout
        <v-spacer></v-spacer>
        <v-icon @click="closeModal">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-alert v-if="alert" color="red" dark>{{ alert }}</v-alert>
        <v-alert v-if="success" color="success" dark>{{ success }}</v-alert>
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
        <div class="alert alert-danger" v-if="disabled">Please wait a few minutes before attempting another payout.</div>
      </v-card-text>
      <v-card-actions v-if="paypal_setup && payoutAmount >= 20">
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="doPayout" :disabled="disabled">Payout</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'

export default {
  props: {
    payoutAmount: {
      type: [String, Number]
    },
    type: String,
    lastPayout: {
      type: [String, null]
    }
  },
  data: function () {
    return {
      dialog: false,
      amount: 20,
      alert: null,
      success: null,
      disabled: false,
      clicked: false
    }
  },
  computed: {
    ...mapGetters({
      paypal_setup: 'getPaypalEnabled'
    })
  },
  methods: {
    closeModal: function () {
      this.dialog = false
      this.$emit('close')
    },
    openModal: function () {
      this.dialog = true
    },
    doPayout: async function () {
      this.clicked = true
      this.success = null
      this.alert = null

      try {
        let { data: { data } } = await Vue.$http.post(`v1/payment/payout`, { type: this.type })
        if (!data.success) {
          this.alert = data.error_detail
        } else {
          this.success = 'Successfully processed payout!'
        }
      } catch (err) {
        console.error(err)
        this.$sentry.captureException(err)
      }
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
