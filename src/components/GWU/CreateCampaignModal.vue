<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card :loading="loading">
      <v-card-title class="headline">
        Create Campaign&nbsp;
        <v-tooltip top color="primary" max-width="300" v-if="step === 3">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="primary"
              v-bind="attrs"
              v-on="on"
            >
              mdi-information
            </v-icon>
          </template>
          <span class="tooltip-text">
            Your bid amount is how much you wish to pay for a single conversion. The higher the bid, the more your song will appear, but too high of a bid will result in fewer overall conversions. We suggest a bid around $0.15.
          </span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-icon @click="closeModal">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <div v-if="step === 1">
          <dl class="text-center gwu-terms-list">
            <dt>One time campaign or subscription?</dt>
            <dd>Please allow 1 - 3 business days for your campaign to be reviewed.</dd>
          </dl>
          <div class="d-flex justify-space-between px-4">
            <v-btn color="primary" @click="subscription = false; step++;">One Time</v-btn>
            <v-btn color="primary" @click="subscription = true; step++;">Subscription</v-btn>
          </div>
        </div>
        <div v-if="step > 1 && !subscription">
          <budget-buttons v-if="step === 2" @next-step="step++" @back-step="step--" @budget-selected="setBudget" />
          <campaign-form v-if="step === 3" @next-step="step++" @back-step="step--" :budget="budget" :campaign="form" @set-form="setForm" />
        </div>
        <div v-if="step > 1 && subscription">
          <select-plan v-if="step === 2" @next-step="step++" @back-step="step--" @plan-selected="setPlan" @toggle-loading="toggleLoading" />
          <subscription-form v-if="step === 3" @next-step="step++" @back-step="step--" :plan="subscriptionPlan" :campaign="form" @set-form="setForm" />
        </div>
        <campaign-review
          v-if="(!subscription && step === 4) || (subscription && step === 4)" :campaign="form" :is-subscription="subscription" :subscription-plan="subscriptionPlan" @next-step="step++"
          @back-step="step--" @set-id="setGWUCampaignId"
        />
        <payment-form v-if="step === 5" :campaign="form" :is-subscription="subscription" :subscription-plan="subscriptionPlan" :id="gwu_campaign_id" @back-step="step--" @next-step="step++" />
        <payment-success v-if="step === 6" @close="closeModal" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import BudgetButtons from '@/components/GWU/Modal/OneTime/BudgetButtons'
import CampaignForm from '@/components/GWU/Modal/OneTime/CampaignForm'
import CampaignReview from '@/components/GWU/Modal/CampaignReview'
import PaymentForm from '@/components/GWU/Modal/PaymentForm'
import PaymentSuccess from '@/components/GWU/Modal/PaymentSuccess'
import SelectPlan from '@/components/GWU/Modal/Subscription/SelectPlan'
import SubscriptionForm from '@/components/GWU/Modal/Subscription/SubscriptionForm'

export default {
  components: {
    BudgetButtons,
    CampaignForm,
    CampaignReview,
    PaymentForm,
    PaymentSuccess,
    SelectPlan,
    SubscriptionForm
  },
  data: function () {
    return {
      dialog: false,
      step: 1,
      subscription: false,
      budget: null,
      subscriptionPlan: null,
      form: null,
      loading: false,
      gwu_campaign_id: null
    }
  },
  methods: {
    openModal: function (campaign) {
      if (campaign) {
        this.gwu_campaign_id = campaign.id
        this.form = campaign
        this.subscriptionPlan = campaign.gwu_plan
        this.subscription = campaign.is_subscription
        this.step = 5
      } else {
        this.step = 1
      }
      this.dialog = true
    },
    closeModal: function () {
      this.step = 1
      this.form = null
      this.subscription = false
      this.dialog = false
      this.$emit('reload')
    },
    setBudget: function (amount) {
      this.budget = amount
    },
    setForm: function (form) {
      this.form = form
    },
    setPlan: function (plan) {
      this.subscriptionPlan = plan
    },
    toggleLoading: function (toggle) {
      this.loading = toggle
    },
    setGWUCampaignId: function (id) {
      this.gwu_campaign_id = id
    }
  }
}
</script>

<style scoped>
.gwu-terms-list {
  max-width: 80%;
  margin: 30px auto;
}

.gwu-terms-list dt {
  text-transform: uppercase;
}

.gwu-terms-list dd {
  margin: 10px 0;
}
</style>
