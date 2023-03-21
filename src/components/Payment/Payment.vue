<template>
  <div class="payment-wrap" v-bind:class="{disabled: disabled}">
    <!--existing card::start-->
    <div v-if="showPaymentMethods">
      <v-row v-if="paymentMethods.length > 0">
        <v-col>
          <p>Select Existing Card</p>
          <v-select
            :items="paymentMethods"
            outlined
            v-model="selectedPaymentMethod"
            label="Select One Card"
            item-text="text"
            item-value="id"
          ></v-select>
        </v-col>
      </v-row>

      <v-row v-if="paymentMethods.length > 0" class="my-2">
        <v-col class="text-center">
          <v-btn
            color="primary"
            :disabled="processingExistingPayment || !selectedPaymentMethod"
            :loading="processingExistingPayment"
            @click="doStripePayment(true)"
          >
            Make Payment
          </v-btn>
        </v-col>
      </v-row>
      <VuetifyProgressDialog v-if="processingExistingPayment" message="Processing request ..." />
    </div>
    <!--existing card::end-->
    <v-row v-if="!selectedPaymentMethod" class="my-2">
      <v-col cols="12">
        <div class="stripe-wrap">
          <v-alert
            v-if="validationErrors"
            type="error"
          >
            {{ validationErrors }}
          </v-alert>
          <div
            v-if="paymentOptions.indexOf('stripe') !== -1"
            ref="card"
            class="StripePayment"
          />
          <v-tooltip
            top
            max-width="300"
            class="payment-cvc-tooltip"
          >
            <template v-slot:activator="{ on }">
              <v-icon v-on="on">
                mdi-help-circle-outline
              </v-icon>
              <span class="payment-cvc-hint">CVC</span>
            </template>
            A three digit code, usually found on the back of your card, used to verify the validity of your card.
          </v-tooltip>
          <v-checkbox
            v-if="subscription"
            v-model="rememberCard"
            label="Remember This Card"
          ></v-checkbox>

          <v-btn
            class="pay-btn"
            color="success"
            :disabled="loading"
            @click="subscription ? doStripeRecurringPayment() : doStripePayment()"
          >
            <span v-if="!loading">{{ subscription ? 'Subscribe' : 'Pay' }}</span>
            <span v-if="loading">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular> Processing...
            </span>
          </v-btn>
        </div>
        <p
          v-if="paymentOptions.length > 1"
          class="text-center my-2"
        >
          Or
        </p>
        <div
          v-if="paymentOptions.indexOf('paypal') !== -1"
          id="paypal-button"
          class="my-2"
        ></div>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import Vue from 'vue'
import config from '../../config'
import VuetifyProgressDialog from '@/shared/components/VuetifyProgressDialog'

let stripe = Stripe(config.STRIPE_KEY),
  elements = stripe.elements(),
  card = undefined
export default {
  components: {
    VuetifyProgressDialog
  },
  props: {
    type: String,
    price: Number || String,
    paymentUrl: String,
    paymentData: [Object, FormData],
    paymentConfig: {
      type: Object,
      default: function () {
        return {}
      }
    },
    paymentOptions: {
      type: Array,
      default: function () {
        return ['stripe', 'paypal']
      }
    },
    subscription: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showPaymentMethods: {
      type: Boolean,
      default: false
    },
    paymentMethodUrl: {
      type: String,
      default: null
    },
    canPay: {
      type: Boolean,
      default: true
    },
    paymentUpdateUrl: {
      type: String,
      default: 'v1/payment'
    },
    paymentUpdateMethod: {
      type: String,
      default: 'PUT'
    },
    service: {
      type: String,
      default: 'main'
    }
  },
  data: function () {
    return {
      selected: 'paypal',
      key: null,
      loading: null,
      validationErrors: null,
      selectedPaymentMethod: null,
      paymentMethodsRes: [],
      processingExistingPayment: false,
      rememberCard: false
    }
  },
  mounted: function () {
    if (this.paymentOptions.indexOf('stripe') !== -1) {
      card = elements.create('card')
      card.mount(this.$refs.card)
    }
    if (this.paymentOptions.indexOf('paypal') !== -1) {
      this.whenAvailable('paypal', function () {
        paypal.Buttons({
          // the client setting should help with the "window closed" errors
          // if not, this setting should be removed again
          client: {
            sandbox: config.PAYPAL_CLIENT_ID,
            production: config.PAYPAL_CLIENT_ID
          },
          env: config.ENV === 'production' ? 'production' : 'sandbox',
          createOrder: function () {
            if (!this.canPay) {
              this.$emit('payment-attempted')
              this.loading = false
              return
            }
            return Vue.$http.post(this.generateCreateOrderUrl('paypal'), this.paymentData, this.paymentConfig)
              .then(response => {
                this.key = response.data.data.key
                return response.data.data.payment_id
              })
              .catch(err => this.$sentry.captureException(err)) //TODO show errors
          }.bind(this),
          onApprove: function (data) {
            return this.updatePayment({ payer_id: data.payerID })
          }.bind(this)
        }).render('#paypal-button')
      }.bind(this))
    }
    if (this.showPaymentMethods) {
      this.getExistingPaymentMethods()
    }
  },
  beforeDestroy: function () {
    if (this.paymentOptions.indexOf('stripe') !== -1) {
      card.destroy(this.$refs.card)
      this.card = undefined
    }
  },
  methods: {
    async getExistingPaymentMethods () {
      this.processingExistingPayment = true
      try {
        let response = await Vue.$http.get(`v1/user/payment/methods`)
        this.paymentMethodsRes = response.data
      } catch (err) {
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.processingExistingPayment = false
    },
    generateCreateOrderUrl: function (payment_processor) {
      this.loading = true
      this.$emit('toggle-loading', true)
      let url = this.paymentUrl + `?payment=${payment_processor}`
      if (this.key) {
        url += `&key=${this.key}`
      }
      return url
    },
    updatePayment: async function (postData, config = {}) {
      const coupon_id = this.paymentData instanceof FormData ? this.paymentData.get('coupon_id') : this.paymentData.coupon_id
      postData.recurring = this.subscription
      postData.coupon_id = coupon_id
      postData = { ...postData, ...this.getFacebookCookies() }

      this.validationErrors = null
      const {
        data: { data: event }
      } = await Vue.$http.get(
        this.service !== 'main'
          ? `v1/service/${this.service}/pixel-event`
          : 'v1/pixel-event'
      )
      try {
        let { data: { data } } = await Vue.$http({
          method: this.paymentUpdateMethod,
          url: `${this.paymentUpdateUrl}/${this.key}`,
          data: postData,
          ...config
        })
        if (data.status !== 'paid') {
          this.loading = false
          this.validationErrors = data
          this.$emit('payment-error', this.validationErrors)
          return
        }
        data.selected = this.selected
        this.$emit('payment-success', data)
        try {
          this.GAEvent(['send', 'event', 'form', 'submit', this.type, this.price])
          fbq('track', 'Purchase', { currency: 'USD', value: this.price }, { eventID: event.event_id })
        } catch (err) {
          this.throwError(err)
        }
        this.loading = false
      } catch (err) {
        this.loading = false
        this.validationErrors = err
        this.$emit('toggle-loading', false)
        this.$sentry.captureException(err)
      }
      this.$emit('toggle-loading', false)
    },
    doStripePayment: async function (existing = false) {
      this.selected = 'stripe'
      let cardOptions = {}
      let paymentApiUrl = ''
      this.validationErrors = null
      try {
        if (existing) {
          cardOptions.payment_method = this.selectedPaymentMethod
          paymentApiUrl = this.paymentMethodUrl
          this.paymentData.payment_method = this.selectedPaymentMethod
          this.paymentData.existing_card = 1
          this.processingExistingPayment = true
        } else {
          cardOptions.payment_method = {
            card: card
          }

          if (this.rememberCard) {
            this.paymentData.remember_card = this.rememberCard
            cardOptions.setup_future_usage = 'off_session'
          }
          paymentApiUrl = this.generateCreateOrderUrl('stripe')
        }
        if (!this.canPay) {
          this.$emit('payment-attempted')
          this.loading = false
          return
        }
        const response = await Vue.$http.post(paymentApiUrl, this.paymentData, this.paymentConfig)
        let responseData = response.data.data
        if (responseData.hasOwnProperty('success') && responseData.success === false) {
          if (responseData.hasOwnProperty('error_detail')) {
            this.validationErrors = responseData.error_detail
            this.loading = false
          }
        } else {
          this.key = response.data.data.key
          let payment_id = response.data.data.payment_id
          const { error } = await stripe.confirmCardPayment(payment_id, cardOptions)
          if (error) {
            this.loading = false
            this.validationErrors = error.message
            this.$emit('payment-error', error)
            this.$emit('toggle-loading', false)
            return
          }
          this.updatePayment({})
        }
      } catch (err) {
        this.$emit('payment-error', err)
        this.loading = false
        this.$emit('toggle-loading', false)
        this.$sentry.captureException(err)
      }
      this.processingExistingPayment = false
    },
    doStripeRecurringPayment: async function () {
      this.validationErrors = null
      this.selected = 'stripe'
      const { data: { data } } = await Vue.$http.post(this.generateCreateOrderUrl('stripe'), this.paymentData, this.paymentConfig)
      this.key = data.key
      const { error, setupIntent } = await stripe.confirmCardSetup(data.payment_id, {
        payment_method: {
          card: card
        }
      })
      if (error) {
        this.loading = false
        this.validationErrors = error.message
        return
      }
      this.updatePayment({ payment_method: setupIntent.payment_method })
    }
  },
  computed: {
    paymentMethods () {
      let results = []
      let uniqueCards = []
      this.paymentMethodsRes.forEach(function (item) {
        if (!uniqueCards.includes(item.last4)) {
          let itemObj = {
            id: item.id,
            text: `${item.brand} - x${item.last4} ${item.exp_month}/ ${item.exp_year}`
          }
          results.push(itemObj)
          uniqueCards.push(item.last4)
        }
      })
      return results
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled {
  position: relative;

  &:after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, .3);
    border-radius: 3px;
  }
}

.pay-btn {
  margin-top: 4px;
  width: 100%;
  border-radius: 4px;
  font-family: Verdana, Geneva, sans-serif;
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

.payment-cvc-hint {
  font-size: 10px;
}

#paypal-button {
  padding: 0 0 20px;
}
</style>
