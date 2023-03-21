<template>
  <v-card elevation="2">
    <v-card-title class="headline">
      <h2 class="text-uppercase text-muted d-block w-100 mb-1 h6">
        Subscription Plans
      </h2>
      <v-row>
        <v-col cols="12" class="pl-3">
          <h5 class="h3 mb-0 m-2 mb-5">
            <span v-if="planId === null || planId === ''">Select Plan</span>
            <span v-else-if="planId">Current Plan: {{ currentPlan.name }}</span>

          </h5>

        </v-col>
      </v-row>
    </v-card-title>
    <div v-if="this.$route.params.restricted === 'no_more_layouts'">
      <v-alert
        border="bottom"
        colored-border
        type="warning"
        elevation="2"
        class="ml-4 mr-4 mb-4"
      >
        <h3>No More Layouts Available</h3>
        Your subscription doesn't allow you to create any more new layouts. In order to create more layouts please subscribe to either the monthly or yearly subscription below.
        <br><br>If you want to edit the layout you created already, please use <strong>"My LNK's"</strong> above.
      </v-alert>
    </div>
    <v-card-text class="mt-5">
      <MiniProfilePlanInfo
        v-if="
          showMiniProfilePlanInfo === true &&
            planId === null
        "
      />

      <v-row
        justify="center"
        v-if="fetchingPlans"
        class="mb-4"
      >
        <v-col cols="6" class="p-2 text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-col>
      </v-row>

      <v-row
        justify="center"
        class="mb-4"
        v-if="planSuccess || paymentSuccess"
      >
        <v-col md="6" class="text-center">
          <v-icon
            color="green"
            x-large
          >
            mdi-check-circle-outline
          </v-icon>
          <h1>
            <span v-if="paymentSuccess">Thank you for your purchase!</span>
            <span v-else>Thank you!</span>
          </h1>
          <h3 class="mb-5">
            You can create new layouts
            <v-btn
              :to="{ name: 'artist.links.design' }"
              color="primary"
              small
              text
            >here
            </v-btn
            >
          </h3>
        </v-col>
      </v-row>

      <VuetifyProgressDialog v-if="processing" />

      <v-row justify="center">
        <v-col sm="11" md="11" lg="10">
          <MiniProfilePlanPricing
            @select-plan="selectPlan"
            :plans="plans"
            :plan-id="planId"
            :model-id="profileId"
            v-if="showPlans"
          />
          <div class="mt-5" id="choosen-plan-payment">
            <v-row v-if="planChosenDetails">
              <v-col md="3" cols="12" class="text-center">
                <p>
                  <strong>{{ planChosenDetails[0].name }}</strong>
                </p>
                <p>${{ planChosenDetails[0].price }}</p>
              </v-col>
              <v-col md="6" cols="12" class="mb-5">
                <Payment
                  v-if="showPayment"
                  :paymentOptions="['stripe']"
                  :subscription="true"
                  payment-url="v1/user/mini-profile/layout"
                  :payment-data="paymentData"
                  @payment-success="onPaymentSuccess"
                  type="artistlinksplan"
                  :price="Math.ceil(plan.price)"
                />
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

import Payment from '@/components/Payment/Payment'
import MiniProfilePlanInfo from '@/components/MiniProfile/MiniProfilePlanInfo'
import MiniProfilePlanPricing from '@/components/MiniProfile/MiniProfilePlanPricing'
import VuetifyProgressDialog from '@/shared/components/VuetifyProgressDialog'

export default {
  components: {
    Payment,
    MiniProfilePlanInfo,
    MiniProfilePlanPricing,
    VuetifyProgressDialog
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      showMiniProfilePlanInfo: true,
      processing: false,
      fetchingPlans: false,
      showPayment: false,
      plans: [],
      plan: null,
      paymentData: {
        plan_id: null
      },
      showBackButton: false,
      planChosenId: null,
      planChosenDetails: null,
      swap: false,
      paymentSuccess: false,
      planSuccess: false,
      showPlans: true

    }
  },
  methods: {
    ...mapActions({
      getPlanDB: 'MiniProfile/getPlan',
      fetchSettings: 'fetchSettings'
    }),
    async getPlans () {
      this.fetchingPlans = true
      try {
        let plansResponse = await Vue.$http.get(`v1/mini-profile/plans`)
        this.plans = plansResponse.data.data
      } catch (error) {
        this.$sentry.captureException(error)
      }
      this.fetchingPlans = false
    },
    async buyMiniProfile (planId) {
      this.processing = true
      try {
        let buyLayoutResponse = await Vue.$http.post(
          `v1/user/mini-profile/layout`,
          {
            plan_id: planId
          }
        )
        console.log(buyLayoutResponse)

        this.planId = buyLayoutResponse.data.data.plan_id
        this.$noty.success('Plan enabled successfully.')
        this.fetchSettings().then(() => {
          // this.$router.push({ name: "artist.links.design" });
        })
        this.processing = false
        this.showPlans = false
        this.planSuccess = true
        this.planChosenDetails = null
      } catch (error) {
        this.$sentry.captureException(error)
        this.$noty.warning('Error Occurred while processing request.')
        this.processing = false
      }
    },
    upgradePlanButton () {
      this.showPriceTable = true
      this.showBackButton = true
      this.maxWidth = 1100
    },
    selectPlan (data) {
      let planId = data.planId
      this.planChosenId = planId
      this.plan = this.plans.filter(v => v.id === planId)[0]
      this.showMiniProfilePlanInfo = false
      console.log(planId)
      console.log(data)

      if (this.plan.price === 0) {
        this.buyMiniProfile(planId)
      } else {
        this.paymentData.plan_id = planId
        this.paymentData.swap = data.swap
        this.showPayment = true
        this.$vuetify.goTo('#choosen-plan-payment')
      }
    },
    layoutSwitched (selected_layout) {
      this.$emit('layout-switched', selected_layout)
    },
    onPaymentSuccess: function () {
      this.$store.dispatch('fetchSettings')
      this.$noty.success('Plan enabled successfully.')
      this.fetchSettings().then(() => {
        this.processing = false
      })
      this.planChosenDetails = null
      this.getPlanDB(this.username)
      this.processing = false
      this.showPayment = false
      this.showPlans = false
      this.paymentSuccess = true

      this.$vuetify.goTo(0, {
        duration: 300
      })
    }
  },
  computed: {
    ...mapGetters({
      layoutId: 'MiniProfile/getSelectedLayout',
      getUserLayoutData: 'MiniProfile/getUserLayoutData'
    }),
    profileId () {
      return this.getUserLayoutData.modelId
    },
    planId () {
      return this.getUserLayoutData.planId
    },
    selectedLayout () {
      return this.getUserLayoutData.selectedLayoutDb
    },
    showPriceTable () {
      return !!this.getUserLayoutData.planId
    },
    currentPlan () {
      if (this.getUserLayoutData.planId !== null && this.plans.length > 0) {
        let planId = this.getUserLayoutData.planId
        return this.plans.filter(function (item) {
          return item.id === planId
        })[0]
      } else {
        return 1
      }
    }
  },
  created () {
    this.getPlans()
  },
  watch: {
    planChosenId: function (newVal) {
      if (newVal > 1) {
        this.planChosenDetails = this.plans.filter(function (plan) {
          return plan.id === newVal
        })
      }
    }
  }
}
</script>
<style scoped>
p {
  font-size: 18px;
}
</style>
