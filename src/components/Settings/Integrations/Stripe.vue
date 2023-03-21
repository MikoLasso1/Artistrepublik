<template>
  <div>
    <h3 class="h3">Stripe</h3>
    <v-alert v-model="alert" :type="messageType" dismissible>{{ message }}</v-alert>
    <v-btn v-if="!stripeEnabled" color="primary" min-width="100%" :href="stripeLink">
      <v-icon left dark>mdi-currency-usd</v-icon>
      Connect Stripe
    </v-btn>
    <v-dialog v-else v-model="confirmationAlert" max-width="290">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red"
          dark
          min-width="100%"
          v-bind="attrs"
          v-on="on"
        >
          Disconnect Stripe
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Disconnect Stripe?</v-card-title>
        <v-card-text>Are you sure you want to disconnect your stripe account?</v-card-text>
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
import config from '../../../config'

export default {
  props: {
    stripeEnabled: Boolean
  },
  data: function () {
    return {
      alert: false,
      messageType: 'success',
      message: '',
      confirmationAlert: false
    }
  },
  computed: {
    stripeLink: function () {
      return `https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=${config.STRIPE_CLIENT_ID}&scope=read_write`
    }
  },
  methods: {
    ...mapActions({
      fetchSettings: 'fetchSettings'
    }),
    goToStripe: function () {
      window.localStorage.setItem('code_type', 'stripe')
      window.location = this.stripeLink
    },
    doDisconnect: async function () {
      await Vue.$http.delete('v1/stripe')
      await this.fetchSettings()
      this.confirmationAlert = false
    }
  },
  created: async function () {
    if (this.$route.query.code && window.localStorage.getItem('code_type') === 'stripe') {
      try {
        await Vue.$http.post('v1/stripe', { code: this.$route.query.code })
        this.messageType = 'success'
        this.message = 'Stripe Account Linked!'
      } catch (err) {
        console.error(err)
        this.messageType = 'error'
        this.message = 'An unknown error has occured!'
      }
      this.alert = true
      this.fetchSettings()
      window.localStorage.removeItem('code_type')
    }
  }
}
</script>

<style>

</style>
