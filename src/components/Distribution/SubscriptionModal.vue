<template>
  <v-dialog v-model="dialog" width="500" class="subscriptionmodal">
    <v-card>
      <v-card-title>
        <h2 class="subscriptionmodal-heading">Distribution Subscription</h2>
      </v-card-title>
      <v-card-text>
        <h3 style="text-align: center; padding-bottom: 25px;">Orders Processed: {{ orderCount }}</h3>
        <subscription-features @loaded="subscriptionsLoading = false" @set-plan="setSelectedPlan" />
        <div class="my-5 d-flex justify-center">
          <v-checkbox
            v-if="!subscriptionsLoading"
            v-model="agreeStatus"
            required
          >
            <div slot="label">
              I agree with the
              <a :href="termConditionsUrl" target="_blank" @click.stop>&nbsp;Terms and Conditions</a> and <a :href="policyUrl" target="_blank" @click.stop>Privacy Policy</a>
            </div>
          </v-checkbox>
        </div>
        <payment
          v-if="!subscriptionsLoading"
          :disabled="!agreeStatus"
          payment-url="v1/subscription/plan"
          :payment-data="{plan_id: plan.id}"
          :subscription="true"
          :paymentOptions="[`stripe`]"
          @payment-success="onPaymentSuccess"
          :key="componentKey"
          :type="subscriptionType"
          :price="Math.ceil(plan.price)"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import SubscriptionFeatures from '@/components/Distribution/SubscriptionFeatures'
import Payment from '@/components/Payment/Payment'

export default {
  components: {
    SubscriptionFeatures,
    Payment
  },
  data: function () {
    return {
      subscriptionsLoading: true,
      dialog: false,
      plan: null,
      agreeStatus: false,
      termConditionsUrl: 'https://www.artistrepublik.com/tos',
      policyUrl: 'https://www.artistrepublik.com/privacy',
      componentKey: 0,
      orderCount: ''
    }
  },
  computed: {
    subscriptionType () {
      if (this.plan.id === 7) {
        return 'distributionsubscription'
      } else if (this.plan.id === 8) {
        return 'curatorsubscription'
      } else {
        return null
      }
    }
  },
  methods: {
    ...mapActions({
      fetchSettings: 'fetchSettings'
    }),
    openModal: function () {
      this.componentKey++
      this.dialog = true
    },
    setSelectedPlan: function (plan) {
      this.plan = plan
    },
    onPaymentSuccess: async function () {
      await this.fetchSettings()
      this.dialog = false
      this.$emit('subscribed')
    }
  },
  created: async function () {
    await this.$store.dispatch('updateIntentStep', 'checkout')
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

<style>
h2.subscriptionmodal-heading {
  word-break: break-word;
}
</style>
