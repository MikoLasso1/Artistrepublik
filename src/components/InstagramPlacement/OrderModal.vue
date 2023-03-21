<template>
  <v-dialog v-model="dialog" ref="modal" max-width="700" scrollable>
    <v-card :loading="loading">
      <v-card-title class="headline">
        Instagram Placement
        <v-spacer></v-spacer>
        <v-icon @click="dialog = false">mdi-close</v-icon>
      </v-card-title>
      <v-card-subtitle>
        <span v-if="step === 1">Terms and Conditions</span>
        <span v-if="step === 2">Choose Placement Accounts</span>
        <span v-if="step === 3">Create Placement</span>
        <span v-if="step === 4">Checkout</span>
      </v-card-subtitle>
      <v-card-text>
        <features-terms-and-conditions v-if="step === 1" @next-step="onNextStep" />
        <choose-placement-accounts
          v-if="step === 2"
          @next-step="onNextStep"
          @toggle-loading="onToggleLoading"
        />
        <create-placement
          v-if="step === 3"
          @next-step="onNextStep"
          @back-step="onBackStep"
          @placement-created="onPlacementCreated"
          :placement="placement"
          @toggle-loading="onToggleLoading"
        />
        <checkout
          v-if="step === 4"
          @back-step="onBackStep"
          @next-step="onNextStep"
          :placement="placement"
          @toggle-loading="onToggleLoading"
        />
        <payment-success v-if="step === 5" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import FeaturesTermsAndConditions from '@/components/InstagramPlacement/OrderModal/FeaturesTermsAndConditions'
import ChoosePlacementAccounts from '@/components/InstagramPlacement/OrderModal/ChoosePlacementAccounts'
import CreatePlacement from '@/components/InstagramPlacement/OrderModal/CreatePlacement'
import Checkout from '@/components/InstagramPlacement/OrderModal/Checkout'
import PaymentSuccess from '@/components/InstagramPlacement/OrderModal/PaymentSuccess'

export default {
  components: {
    FeaturesTermsAndConditions,
    ChoosePlacementAccounts,
    CreatePlacement,
    Checkout,
    PaymentSuccess
  },
  data: function () {
    return {
      dialog: false,
      loading: false,
      step: 1,
      placement: null
    }
  },
  methods: {
    openModal: function () {
      this.dialog = true
    },
    onNextStep: function () {
      this.step++
      this.modalScrollTop()
    },
    onBackStep: function () {
      this.step--
      this.modalScrollTop()
    },
    onToggleLoading: function (toggle) {
      this.loading = toggle
    },
    onPlacementCreated: function (placement) {
      this.placement = placement
    },
    modalScrollTop: function () {
      this.$refs.modal.$el.scrollIntoView()
    }
  }
}
</script>

<style>

</style>
