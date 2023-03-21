<template>
  <div>
    <span v-if="!card.card_brand">No cards on file</span>
    <div class="cc">
      <img :src="`/img/card-brands/${cardImageName}`" alt="Card Brand" loading="lazy">
      <span class="card-number">
        XXXX-XXXX-XXXX-{{ card.card_last_four }}
        <br />
        <a class="primary--text" @click.stop="dialog = true">Update</a>
      </span>
    </div>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Update Credit Card</v-card-title>
        <v-card-text>
          <loading-overlay :loading="loading" />
          <v-alert v-if="error" color="red" dark>{{ error }}</v-alert>
          <div ref="card" class="StripePayment" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="doCCUpdate">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'
import config from '../../config'
import LoadingOverlay from '@/components/LoadingOverlay'

let stripe = Stripe(config.STRIPE_KEY),
  elements = stripe.elements(),
  card = undefined
export default {
  components: {
    LoadingOverlay
  },
  data: function () {
    return {
      dialog: false,
      paymentId: null,
      error: null,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      card: 'getCardDetails'
    }),
    cardImageName: function () {
      let cardImage = ''
      switch (this.card.card_brand) {
        case 'visa':
          cardImage = 'visa.png'
          break
        case 'mastercard':
          cardImage = 'mastercard.png'
          break
        case 'amex':
          cardImage = 'american-express.png'
          break
        case 'discover':
          cardImage = 'discover.png'
          break
      }
      return cardImage
    }
  },
  watch: {
    dialog: async function (v) {
      if (v) {
        this.loading = true
        let { data: { data } } = await Vue.$http.get('v1/settings/update-cc')
        this.paymentId = data.payment_id
        card = elements.create('card')
        card.mount(this.$refs.card)
        this.loading = false
      } else {
        card.destroy(this.$refs.card)
        this.card = undefined
      }
    }
  },
  methods: {
    ...mapActions({
      fetchSettings: 'fetchSettings'
    }),
    doCCUpdate: async function () {
      this.error = false
      this.loading = true
      const { error, setupIntent } = await stripe.confirmCardSetup(this.paymentId, {
        payment_method: {
          card: card
        }
      })
      if (error) {
        this.error = error.message
        this.loading = false
        return
      }
      const { data: { data } } = await Vue.$http.post('v1/settings/update-cc', { payment_method: setupIntent.payment_method })
      if (!data.success) {
        this.error = 'An unkown error has occured.'
        this.loading = false
        return
      }
      this.$noty.success('Updated successfully')
      this.fetchSettings()
      this.dialog = false
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.cc {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;

  img {
    height: 35px;
  }

  .card-number {
    word-wrap: break-word;
    text-align: right;
  }
}

.StripeElement {
  box-sizing: border-box;
  height: 40px;
  padding: 10px 12px;
  margin: 10px 0 10px 0;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripePayment label {
  font-family: 'Montserrat', sans-serif;
  color: #3d2151;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>
