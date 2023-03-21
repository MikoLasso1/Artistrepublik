<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card :loading="loading">
      <v-card-title>
        <h2 class="headline">Grow With Us</h2>
        <v-spacer></v-spacer>
        <v-icon @click="step = 1; dialog = false">mdi-close</v-icon>
      </v-card-title>
      <v-card-subtitle class="d-flex">
        <span v-if="step === 1">Terms and Conditions</span>
        <span v-if="step === 2">Plan Type</span>
        <span v-if="step === 3">{{ isSubscription ? 'Plan Type' : 'Budget' }}</span>
        <span v-if="step === 4">Campaign Details</span>
        <span v-if="step === 5">Review</span>
        <span v-if="step === 6">Payment</span>
        <v-spacer></v-spacer>
        <span v-if="loggedIn && user">
          Signed in as {{ user.name !== ' ' ? user.name : user.username }} - <a href="#" @click.prevent="doLogout">Logout</a>
        </span>
      </v-card-subtitle>
      <v-card-text>
        <features-terms-and-conditions v-if="step === 1" @next-step="step++" />
        <plan-type v-if="step === 2" @next-step="step++" @is-subscription="planTypeChange" />
        <div v-if="step > 2 && !isSubscription">
          <budget-buttons v-if="step === 3" @next-step="step++" @back-step="step--" @budget-selected="setBudget" />
          <campaign-form v-if="step === 4" @next-step="step++" @back-step="step--" :budget="budget" :campaign="form" @set-form="setForm" />
        </div>
        <div v-if="step > 2 && isSubscription">
          <select-plan v-if="step === 3" @next-step="step++" @back-step="step--" @plan-selected="setPlan" @toggle-loading="toggleLoading" />
          <subscription-form v-if="step === 4" @next-step="step++" @back-step="step--" :plan="subscriptionPlan" :campaign="form" @set-form="setForm" />
        </div>
        <campaign-review
          v-if="(!isSubscription && step === 5) || (isSubscription && step === 5)" :campaign="form" :is-subscription="isSubscription" :subscription-plan="subscriptionPlan"
          @next-step="step++" @back-step="step--" @set-id="setGWUCampaignId"
        />
        <payment-form v-if="step === 6" :campaign="form" :is-subscription="isSubscription" :subscription-plan="subscriptionPlan" :id="gwu_campaign_id" @back-step="step--" @next-step="step++" />
        <payment-success v-if="step === 7" @close="routeUser()" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import FeaturesTermsAndConditions from '@/components/Public/GWU/FeaturesTermsAndConditions.vue'
import RegisterModalView from '@/components/Public/RegisterModalView.vue'
import PlanType from '@/components/Public/GWU/PlanType.vue'
import SelectPlan from '@/components/GWU/Modal/Subscription/SelectPlan.vue'
import CampaignReview from '@/components/GWU/Modal/CampaignReview.vue'
import PaymentForm from '@/components/GWU/Modal/PaymentForm.vue'
import PaymentSuccess from '@/components/GWU/Modal/PaymentSuccess.vue'
import SubscriptionForm from '@/components/GWU/Modal/Subscription/SubscriptionForm.vue'
import BudgetButtons from '@/components/Public/GWU/BudgetButtons.vue'
import CampaignForm from '@/components/GWU/Modal/OneTime/CampaignForm.vue'

export default {
  components: {
    FeaturesTermsAndConditions,
    RegisterModalView,
    PlanType,
    SelectPlan,
    CampaignReview,
    PaymentForm,
    PaymentSuccess,
    SubscriptionForm,
    BudgetButtons,
    CampaignForm
  },
  data: function () {
    return {
      dialog: false,
      loading: false,
      step: 1,
      isSubscription: false,
      subscriptionPlan: null,
      form: null,
      gwu_campaign_id: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser',
      loggedIn: 'isAuthenticated'
    })
  },
  methods: {
    ...mapActions({
      logout: 'logout'
    }),
    openModal: function () {
      this.dialog = true
    },
    doLogout: async function () {
      await this.logout()
      this.dialog = false
      this.step = 1
    },
    toggleLoading: function (v) {
      this.loading = v
    },
    planTypeChange: function (isSubscription) {
      this.isSubscription = isSubscription
    },
    setPlan: function (plan) {
      this.subscriptionPlan = plan
    },
    setForm: function (form) {
      this.form = form
    },
    setGWUCampaignId: function (id) {
      this.gwu_campaign_id = id
    },
    setBudget: function (amount) {
      this.budget = amount
    },
    routeUser () {
      this.step = 1
      this.dialog = false,
        this.$router.push({ path: '/features/grow' })
    }
  }
}
</script>

<style>

</style>
