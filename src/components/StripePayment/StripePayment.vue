<template>
  <div>
    <div
      ref="card"
      class="StripePayment"
    >
      <div class="row">
        <label for="card-element">
          Credit or Debit Card
        </label>
        <div id="card-element" />
      </div>
    </div>
    <div v-if="errors">
      <b-alert
        show
        variant="danger"
      >
        {{ errors }}
      </b-alert>
    </div>
  </div>
</template>
<script>
import config from '../../config'

let stripe = Stripe(config.STRIPE_KEY),
  elements = stripe.elements(),
  card = undefined
export default {
  props: {
    client_secret: null,
    amount: null
  },
  data () {
    return {
      status: null,
      errors: null
    }
  },
  watch: {
    client_secret: function (newVal) {
      this.client_secret = newVal
    },
    amount: function (newVal) {
      this.amount = newVal
    }
  },
  mounted: function () {
    card = elements.create('card')
    card.mount(this.$refs.card)
    card.addEventListener('change', function (event) {
      if (event.error) {
        this.errors = event.error.message
      } else {
        this.errors = null
      }
    }.bind(this))
  },
  beforeDestroy () {
    card.destroy(this.$refs.card)
    this.card = undefined
  },
  methods: {
    purchase: async function () {
      return await stripe.confirmCardPayment(this.client_secret, {
        payment_method: {
          card: card
        }
      }).then(res => {
        if (res.error) {
          this.errors = res.error.message
          return this.errors
        }
        if (res.paymentIntent) {
          return true
        }
      })
    },
    charge: async function () {
      const { error, paymentIntent } = await stripe.confirmCardPayment(this.client_secret, {
        payment_method: {
          card: card
        }
      })
      if (error) {
        return error
      }
      return paymentIntent
    },
    createPaymentMethod: async function () {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: card
      })
      if (error) {
        this.errors = error
        return false
      }
      return paymentMethod
    }
  }
}
</script>

<style scoped>
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
