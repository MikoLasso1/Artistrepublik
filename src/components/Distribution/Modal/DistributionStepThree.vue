<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        lg="6"
        order="first"
        order-md="last"
        v-if="!subscriptions.distribution"
      >
        <div class="text-center">
          <h3 class="h3 mb-3">Subscription</h3>
        </div>
        <subscription-features />
        <div class="text-center">
          <v-btn
            color="primary" @click="$refs.subscriptionModal.openModal()"
          >Subscribe
          </v-btn
          >
        </div>
      </v-col>
      <v-col
        class="bordered-column d-flex flex-column"
        cols="12"
        lg="6"
        order="last"
        order-md="first"
      >
        <h3 class="h3 mb-3 text-center">One Time Distribution</h3>
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
            </td>
            <td class="text-center">
              <p>
                <strong> ${{ releaseTypePrice }} </strong>
              </p>
              <p v-if="release.custom_label">$1</p>
              <p>
                <strong>{{ processingFee | centsToDollar }}</strong>
              </p>
              <p>
                <strong>${{ totalWithFee }}</strong>
              </p>
              <p>
                <strong>$0</strong>
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
        <div class="text-center" style="margin-top: auto">
          <v-btn color="primary" @click="$emit(`next-step`)">Pay</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-divider class="mb-1 mt-5" />
    <v-btn @click="doBack" color="primary" class="my-2">Back</v-btn>
    <subscription-modal
      ref="subscriptionModal"
      @subscribed="subscribedSuccessfully"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SubscriptionModal from '@/components/Distribution/SubscriptionModal'
import SubscriptionFeatures from '@/components/Distribution/SubscriptionFeatures'

export default {
  components: {
    SubscriptionModal,
    SubscriptionFeatures
  },
  data: function () {
    return {
      paySubscription: null,
      routeName: this.$route.name,
      agreeStatus: false,
      termConditionsUrl:
        'https://arepublik-static.s3.amazonaws.com/documents/Copyright+policy_+distribution.pdf',
      policyUrl:
        'https://arepublik-static.s3.amazonaws.com/documents/terms+and+conditions_+distribution.pdf',
      loading: null,
      paymentSuccess: false,
      validation: {
        orderError: null
      },
      processingFee: 65
    }
  },
  computed: {
    ...mapGetters({
      release: 'getRelease',
      subscriptions: 'getSubscriptions'
    }),
    releaseTypePrice: function () {
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
    total: function () {
      let total = 0
      if (this.release.custom_label) {
        total += 1
      }
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
      return total
    },
    totalWithFee: function () {
      return this.total + this.processingFee / 100
    }
  },
  created: async function () {
    this.$store.dispatch('updateIntentStep', 'checkout')
    this.processingFee = await this.getProcessingFee(this.total * 100)
  },
  methods: {
    doBack: function () {
      this.$emit('back-step')
    },
    subscribedSuccessfully () {
      this.$emit('subcribed-successfully')
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
