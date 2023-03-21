<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline">{{ title }} Subscription</v-card-title>
      <v-card-text>
        <v-progress-circular v-if="loading" indeterminate color="primary" class="mb-4" />
        <div v-else-if="plans.length">
          <div v-html="plans[0].planable.details" class="text-center"></div>
        </div>
        <div class="my-5 d-flex justify-center">
          <v-checkbox
            v-if="!loading"
            v-model="agreeStatus"
            required
          >
            <div slot="label">
              I agree with the
              &nbsp;<a :href="termConditionsUrl" target="_blank" @click.stop>Terms and Conditions</a> and
              &nbsp;<a :href="policyUrl" target="_blank" @click.stop>Privacy Policy</a>
            </div>
          </v-checkbox>
        </div>
        <payment
          v-if="!loading && plan"
          :disabled="!agreeStatus"
          :payment-url="service ? `v1/service/${service}/subscription/plan` : `v1/subscription/plan`"
          :paymentUpdateUrl="service ? `v1/service/${service}/payment` : `v1/payment`"
          :payment-data="{plan_id: plan.id}"
          :subscription="true"
          :paymentOptions="[`stripe`]"
          @payment-success="onPaymentSuccess"
          :type="gaTrackingType"
          :price="Math.ceil(plan.price)"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import Vue from 'vue'
import Payment from '@/components/Payment/Payment'

export default {
  components: {
    Payment,
  },
  props: {
    title: {
      default: null,
      type: String,
    },
    planType: {
      default: null,
      type: String,
    },
    service: {
      type: String,
      default: null,
    },
  },
  data: function () {
    return {
      subscriptionsLoading: true,
      dialog: false,
      plan: null,
      plans: [],
      agreeStatus: false,
      loading: false,
      termConditionsUrl: 'https://arepublik-static.s3.amazonaws.com/documents/Copyright+policy_+distribution.pdf',
      policyUrl: 'https://arepublik-static.s3.amazonaws.com/documents/terms+and+conditions_+distribution.pdf',
    }
  },
  computed: {
    gaTrackingType() {
      return this.planType + 'subscription'
    },
  },
  methods: {
    ...mapActions({
      fetchSettings: 'fetchSettings',
    }),
    openModal: function () {
      this.dialog = true
    },
    onPaymentSuccess: async function () {
      await this.fetchSettings()
      this.dialog = false
      this.$emit('subscribed')
    },
  },
  mounted: async function () {
    this.loading = true
    try {
      const url = this.service ? `v1/service/${this.service}/subscription/plan?type=${this.planType}` : `v1/subscription/plan?type=${this.planType}`
      let { data: { data } } = await Vue.$http.get(url)
      this.plans = data
      console.log(url)
      this.plan = data[0]
    } catch (err) {
      this.throwError(err)
    }
    this.loading = false
  },
}
</script>
