<template>
  <div>
    <h3 class="h3">Paypal</h3>
    <v-alert v-model="alert" :type="messageType" dismissible>{{ message }}</v-alert>
    <v-btn v-if="!paypalMerchant && !paypalConnectLink" color="primary" min-width="100%" @click="generatePaypalLink">
      <v-icon left dark>mdi-credit-card-outline</v-icon>
      Generate Paypal Link
    </v-btn>
    <v-btn
      v-if="paypalConnectLink"
      color="primary"
      min-width="100%"
      :href="paypalConnectLink"
      data-paypal-button="true"
      target="PPFrame"
    >
      Connect Paypal
    </v-btn>
    <v-dialog v-else-if="paypalMerchant" v-model="confirmationAlert" max-width="290">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red"
          dark
          min-width="100%"
          v-bind="attrs"
          v-on="on"
        >
          Disconnect Paypal
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Disconnect Paypal?</v-card-title>
        <v-card-text>Are you sure you want to disconnect your paypal account?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmationAlert = false">Cancel</v-btn>
          <v-btn color="red darken-1" text @click="doDisconnect">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Vue from 'vue'

export default {
  props: {
    paypalMerchant: Boolean
  },
  data: function () {
    return {
      alert: false,
      messageType: 'success',
      message: '',
      paypalConnectLink: null,
      confirmationAlert: false
    }
  },
  methods: {
    ...mapActions({
      fetchSettings: 'fetchSettings'
    }),
    generatePaypalLink: async function () {
      try {
        let { data: { data } } = await Vue.$http.get(`v1/payment/paypal/onboarding-link`)
        this.paypalConnectLink = data.href
      } catch (err) {
        console.error(err)
      }
    },
    doDisconnect: async function () {
      await Vue.$http.delete('v1/payment/paypal')
      await this.fetchSettings()
      this.confirmationAlert = false
    }
  },
  created: async function () {
    if (this.$route.query.merchantIdInPayPal) {
      try {
        await Vue.$http.post(`v1/payment/paypal`, { paypal_merchant_id: this.$route.query.merchantIdInPayPal })
        this.messageType = 'success'
        this.message = 'Paypal Account Linked!'
      } catch (err) {
        console.error(err)
        this.messageType = 'error'
        this.message = 'An unknown error has occured!'
      }
      this.alert = true
      this.fetchSettings()
    }
    (function (d, s, id) {
      var js, ref = d.getElementsByTagName(s)[0]
      if (!d.getElementById(id)) {
        js = d.createElement(s)
        js.id = id
        js.async = true
        js.src = 'https://www.paypal.com/webapps/merchantboarding/js/lib/lightbox/partner.js'
        ref.parentNode.insertBefore(js, ref)
      }
    }(document, 'script', 'paypal-js'))
  }
}
</script>

<style>

</style>
