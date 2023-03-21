<template>
  <div>
    <h3 style="text-align: center; padding-bottom: 25px">
      Orders Processed: {{ orderCount }}
    </h3>
    <div v-if="!paymentSuccess">
      <tracks-table :tracks="release.tracks" />
      <table class="table">
        <tbody>
        <tr class="light-bg">
          <td />
          <td />
          <td class="text-right">
            <p>
              <strong> {{ release.release_type }}: </strong>
            </p>
            <p v-if="release.custom_label">
              <strong> Custom Label: </strong>
            </p>
            <p>
              <strong>Processing Fee:</strong>
            </p>
            <p>
              <strong>Subtotal:</strong>
            </p>
            <p>
              <strong>Tax:</strong>
            </p>
            <p v-if="couponData.id">
              <strong>Discount:</strong>
            </p>
          </td>
          <td class="text-center">
            <p>
              <strong>
                {{
                  releaseTypePrice === 0
                    ? `Subscription ($0)`
                    : `$${releaseTypePrice}`
                }}
              </strong>
            </p>
            <p v-if="release.custom_label">$1</p>
            <p>
              <strong>{{ processingFee | centsToDollar }}</strong>
            </p>
            <p>
              <strong>${{ subTotal + processingFee / 100 }}</strong>
            </p>
            <p>
              <strong>$0</strong>
            </p>
            <p v-if="couponData.id">
              <strong>{{ '-$' + couponData.price }}</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td />
          <td />
          <td class="text-right">
            <h4>
              <strong>Total:</strong>
            </h4>
          </td>
          <td class="text-center text-danger">
            <h4>
              <strong>${{ totalWithFee }}</strong>
            </h4>
          </td>
        </tr>
        </tbody>
      </table>
      <coupon-code :productType="productType" @set-coupon="setCoupon" />
      <div class="my-2 d-flex justify-center">
        <v-checkbox v-model="agreeStatus" required>
          <div slot="label">
            I agree to &nbsp;<a
            :href="termConditionsUrl"
            target="_blank"
            @click.stop
          >Terms and Conditions</a
          >&nbsp; and &nbsp;<a
            :href="policyUrl" target="_blank" @click.stop
          >Privacy Policy</a
          >
          </div>
        </v-checkbox>
      </div>
      <payment
        v-if="agreeStatus && total !== 0"
        :payment-url="paymentUrl"
        :payment-data="paymentData"
        @payment-success="onPaymentSuccess"
        @payment-error="onPaymentError"
        :show-payment-methods="total === 1"
        :payment-method-url="paymentMethodUrl"
        type="distributionorder"
        :price="Math.ceil(total)"
      />
      <v-alert color="red" type="warning" v-if="orderError !== null">{{
          orderError
        }}
      </v-alert>
      <v-divider class="mb-1 mt-5" />
      <div class="d-flex">
        <v-btn @click="$emit(`back-step`)" color="primary">Back</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="total === 0"
          :disabled="!agreeStatus"
          @click="doSubmit"
          color="primary"
        >Submit
        </v-btn
        >
      </div>
    </div>
    <div v-else>
      <DistributionSuccess :newRelease="release" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import TracksTable from '@/components/Distribution/Modal/TracksTable'
import Payment from '@/components/Payment/Payment'
import DistributionSuccess from '@/components/Distribution/DistributionSuccess'
import CouponCode from '@/components/CouponCode'

export default {
  components: {
    TracksTable,
    Payment,
    DistributionSuccess,
    CouponCode
  },
  data: function () {
    return {
      agreeStatus: false,
      termConditionsUrl:
        'https://arepublik-static.s3.amazonaws.com/documents/Copyright+policy_+distribution.pdf',
      policyUrl:
        'https://arepublik-static.s3.amazonaws.com/documents/terms+and+conditions_+distribution.pdf',
      paymentSuccess: false,
      orderError: null,
      couponData: {},
      orderCount: '',
      routeName: this.$route.name,
      processingFee: 65
    }
  },
  computed: {
    ...mapGetters({
      release: 'getRelease',
      subscriptions: 'getSubscriptions'
    }),
    paymentUrl: function () {
      return `v1/distribution/release/${this.release.id}/payment`
    },
    paymentMethodUrl: function () {
      return `v1/distribution/release/${this.release.id}/custom-label-payment`
    },
    paymentData: function () {
      return {
        user_release_id: this.release.id,
        coupon_id: this.couponData.id ? this.couponData.id : ''
      }
    },
    releaseTypePrice: function () {
      if (this.subscriptions.distribution) {
        return 0
      }
      switch (this.release.release_type) {
        case 'Release':
          return 5
        case 'Album':
          return 11
        case 'Mix':
          return 7
      }
      return 0
    },
    subTotal: function () {
      let total = 0
      if (this.release.custom_label) {
        total += 1
      }
      if (!this.subscriptions.distribution) {
        switch (this.release.release_type) {
          case 'Release':
            total += 5
            break
          case 'Album':
            total += 11
            break
          case 'Mix':
            total += 7
            break
        }
      }
      return total
    },
    total: function () {
      let total = this.subTotal

      if (this.couponData.id) {
        total -= this.couponData.price
      }

      return total
    },
    totalWithFee: function () {
      return this.total + this.processingFee / 100
    },
    productType: function () {
      return {
        product_type: 'distribution',
        release: this.release.release_type
      }
    }
  },
  methods: {
    doSubmit: async function () {
      let {
        data: { data }
      } = await Vue.$http.post(this.paymentUrl)
      if (data.success) {
        this.paymentSuccess = true
        this.$store.commit('setIntent', null)
      }
    },
    onPaymentSuccess: async function (data) {
      if (data.status === 'paid') {
        this.paymentSuccess = true
        this.$store.commit('setIntent', null)
      }
    },
    onPaymentError: function (error) {
      let err = error.message ? error.message : 'Something went wrong'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstFieldErrors = errors[Object.keys(errors)[0]]
        err = firstFieldErrors
          ? firstFieldErrors[0]
          : err.response.data.message
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.data
      ) {
        err = error.response.data.data.message
      }
      this.orderError = err
    },
    setCoupon: function (data) {
      this.couponData = data
    }
  },
  created: async function () {
    this.processingFee = await this.getProcessingFee(this.total * 100)
    this.$store.dispatch('updateIntentStep', 'checkout')
    try {
      let res = await this.$store.dispatch('getOrderStats', 'distribution')
      this.orderCount = res.data.order_count
    } catch (err) {
      console.error(err)
      this.throwError(err)
    }
  }
}
</script>

<style lang="scss" scoped>
.light-bg {
  background-color: #f6f9fc;
}

.bordered-column {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  @media (max-width: 960px) {
    border-right: none;
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }
}
</style>
