<template>
  <div>
    <h3 style="text-align: center; padding-bottom: 25px">
      Orders Processed: {{ orderCount }}
    </h3>
    <div class="text-center">
      <v-icon color="primary" size="100">currency-usd-circle</v-icon>
      <h4 class="h4">Fund your Campaign</h4>
      <div v-if="!isSubscription">
        <span v-if="couponData.id">
          Campaign SubTotal: ${{ campaign.budget }}
          <br />
        </span>
        <span v-if="couponData.id">Discount: -${{ couponData.price }}</span>
        <p>Processing Fee: {{ processingFee | centsToDollar }}</p>
        <p>Campaign Total: ${{ total }}</p>
      </div>
      <p v-else>Campaign Total: ${{ subscriptionPlan.price }} per month</p>
    </div>
    <coupon-code :productType="productType" @set-coupon="setCoupon" />
    <payment
      payment-url="v1/gwu/pay"
      :paymentData="paymentData"
      :paymentOptions="isSubscription ? ['stripe'] : ['stripe', 'paypal']"
      :subscription="isSubscription"
      @payment-success="onPaymentSuccess()"
      :type="gaTrackingType"
      :price="gaTrackingPrice"
    />
    <div class="text-right mt-4">
      <img
        src="https://arepublik-static.s3.amazonaws.com/img/secure-stripe-payment-logo.png"
        style="height: 50px"
        loading="lazy"
        alt="payment secure"
      />
    </div>
    <div class="mt-6">
      <v-btn color="primary" @click="$emit('back-step')">Back</v-btn>
    </div>
  </div>
</template>

<script>
import Payment from '@/components/Payment/Payment'
import CouponCode from '@/components/CouponCode'

export default {
  components: {
    Payment,
    CouponCode,
  },
  props: {
    campaign: Object,
    isSubscription: Boolean,
    subscriptionPlan: Object,
    id: Number,
  },
  data: function () {
    return {
      couponData: {},
      orderCount: '',
      processingFee: 65,
    }
  },
  computed: {
    paymentData: function () {
      return {
        gwu_campaign_id: this.id,
        coupon_id: this.couponData.id ? this.couponData.id : '',
      }
    },
    gaTrackingType () {
      if (this.isSubscription) {
        return 'gwusubscription'
      } else {
        return 'gwucampaign'
      }
    },
    gaTrackingPrice () {
      if (this.isSubscription) {
        return Math.ceil(this.subscriptionPlan.price)
      } else {
        return Math.ceil(this.campaign.budget)
      }
    },
    productType: function () {
      return {
        product_type: 'gwu',
        gwu_campaign_id: this.id,
      }
    },
    total: function () {
      if (this.couponData.id) {
        return (
          this.campaign.budget -
          this.couponData.price +
          this.processingFee / 100
        )
      } else {
        return Number(this.campaign.budget) + this.processingFee / 100
      }
    },
  },
  methods: {
    onPaymentSuccess () {
      this.$emit('next-step')
    },
    setCoupon: function (data) {
      this.couponData = data
    },
  },
  created: async function () {
    this.processingFee = await this.getProcessingFee()
    this.$store.dispatch('updateIntentStep', 'checkout')
    try {
      let res = await this.$store.dispatch('getOrderStats', 'gwu')
      console.log(res)
      this.orderCount = res.data.order_count
    } catch (err) {
      console.error(err)
      this.throwError(err)
    }
  },
}
</script>

<style>
</style>
