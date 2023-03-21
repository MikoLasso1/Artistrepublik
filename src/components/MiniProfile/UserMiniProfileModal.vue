<template>
  <v-dialog v-model="showMiniProfileModal" :persistent="isPersistant" :max-width="740">
    <v-card>
      <v-card-title class="headline">
        <h2 class="text-uppercase text-muted d-block w-100 mb-1 h6">Artist Links</h2>
        <v-row>
          <v-col cols="12" class="pl-3">
            <h5 class="h3 mb-0">
              <span v-if="planId === null || planId === ''">Select Artist Link</span>
              <span v-else-if="planId === 1">Current Plan: Free</span>
              <span v-else-if="planId === 2">Current Plan: Pro</span>
              <span v-else-if="planId === 3">Current Plan: Enterprise</span>
            </h5>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <MiniProfilePlanInfo
          v-if="showMiniProfilePlanInfo === true && planId === null && showOverlay === false"
        />
        <v-row justify="center" v-if="planId === null || showPriceTable === true && showOverlay === true" class=" mb-4">
          <v-col cols="6" class="p-2 text-center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-col>
        </v-row>
        <v-btn color="primary" class="mb-3" fab x-small dark v-if="showBackButton" @click="showPlans()">
          <v-icon>keyboard_backspace</v-icon>
        </v-btn>
        <MiniProfilePlanPricing
          @select-plan="selectPlan"
          :plans="plans"
          :plan-id="planId"
          :model-id="profileId"
        />
        <v-row v-if="planChosenDetails">
          <v-col md="3" class="text-center">
            <p><strong>{{ planChosenDetails[0].name }}</strong></p>
            <p>${{ planChosenDetails[0].price }}</p>
          </v-col>
          <v-col md="9">
            <Payment
              v-if="showPayment"
              :paymentOptions="['stripe']"
              :subscription="true"
              payment-url="v1/user/mini-profile/layout"
              :payment-data="paymentData"
              @payment-success="onPaymentSuccess"
              type="artistlinksplan"
              :price="Math.ceil(planChosenDetails.price)"
            />
          </v-col>
        </v-row>
        <MiniProfileSwitches
          @upgrade-plan="upgradePlanButton"
          @layout-switched="layoutSwitched"
          v-if="!showPriceTable"
          :plan-id="planId"
          :prev-selected-layout="selectedLayout"
          :profile-id="profileId"
        ></MiniProfileSwitches>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import Vue from 'vue'
import Payment from '../Payment/Payment'
import MiniProfilePlanInfo from '../MiniProfile/MiniProfilePlanInfo'
import MiniProfilePlanPricing from '../MiniProfile/MiniProfilePlanPricing'
import MiniProfileSwitches from '../MiniProfile/MiniProfileSwitches'

export default {
  name: 'UserMiniProfileModal',
  props: {
    showModal: {
      default: true,
      type: Boolean
    },
    persistant: {
      default: false,
      type: Boolean
    }
  },
  components: {
    Payment,
    MiniProfilePlanInfo,
    MiniProfilePlanPricing,
    MiniProfileSwitches
  },
  data () {
    return {
      username: this.$store.getters.getSettings.account.general.username,
      profileId: null,
      showMiniProfilePlanInfo: true,
      showOverlay: false,
      planId: null,
      showPayment: false,
      selectedLayout: null,
      showPriceTable: true,
      plans: null,
      paymentData: {
        plan_id: null
      },
      showMiniProfileModal: true,
      showBackButton: false,
      planChosenId: null,
      planChosenDetails: null,
      swap: false
    }
  },
  methods: {
    async getAlreadySelectedPlan () {
      this.showOverlay = true
      try {
        let plansResponse = await Vue.$http.get(`v1/mini-profile/plans`)
        this.plans = plansResponse.data.data
        let layoutResponse = await Vue.$http.get(`v1/user/mini-profile/layout`, {
          params: {
            username: this.username
          }
        })
        if (layoutresponse.status === 200) {
          this.profileId = layoutResponse.data.data.mini_profile_id
          this.planId = layoutResponse.data.data.plan_id
          this.selectedLayout = layoutResponse.data.data.selected_layout
          if (this.planId) {
            this.showPriceTable = false
          }
        }
        this.showOverlay = false
      } catch (error) {
        this.$sentry.captureException(error)
        this.showOverlay = false
      }
    },
    async buyMiniProfile (planId) {
      this.showOverlay = true
      try {
        let buyLayoutResponse = await Vue.$http.post(
          `v1/user/mini-profile/layout`,
          {
            plan_id: planId
          }
        )
        this.planId = buyLayoutResponse.data.data.plan_id
        this.$noty.success('Plan enabled successfully.')
        this.$router.push({ name: 'artist.links.settings' })
        this.showOverlay = false
        this.$emit('plan-purchased')
        this.showMiniProfileModal = false
        this.planChosenDetails = null
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
        this.showOverlay = false
      }
    },
    upgradePlanButton () {
      this.showPriceTable = true
      this.showBackButton = true
      this.maxWidth = 1100
    },
    showPlans () {
      this.showPayment = false
      this.showBackButton = false
      this.showPriceTable = false
      this.maxWidth = 740
    },
    closeModal () {
      this.showMiniProfileModal = false
    },
    selectPlan (data) {
      let planId = data.planId
      this.planChosenId = planId
      let plan = this.plans.filter(v => v.id === planId)[0]
      this.showMiniProfilePlanInfo = false
      if (plan.price === 0) {
        this.buyMiniProfile(planId)
      } else {
        this.paymentData.plan_id = planId
        this.paymentData.swap = data.swap
        this.showPayment = true
      }
    },
    layoutSwitched (selected_layout) {
      this.$emit('layout-switched', selected_layout)
    },
    onPaymentSuccess: function () {
      this.$store.dispatch('fetchSettings')
      this.$noty.success('Plan enabled successfully.')
      this.planChosenDetails = null
      this.$router.push({ name: 'artist.links.settings' })
      this.showOverlay = false
      this.$emit('plan-purchased')
      this.showMiniProfileModal = false
    }
  },
  computed: {
    isPersistant () {
      return this.persistant ? true : false
    }
  },
  created () {
    this.getAlreadySelectedPlan()
  },
  watch: {
    showModal: function (newVal) {
      this.showMiniProfileModal = newVal
      this.getAlreadySelectedPlan()
    },
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
<style>
.v-dialog.v-dialog--active {
  overflow-y: auto;
}

.v-dialog.v-dialog--active::-webkit-scrollbar {
  width: 11px;
  scrollbar-width: thin;
  scrollbar-color: rgb(220, 209, 223) #eae5eb;
}

.v-dialog.v-dialog--activel::-webkit-scrollbar-track {
  background: #eae5eb;
}

.v-dialog.v-dialog--active::-webkit-scrollbar-thumb {
  background-color: rgb(220, 209, 223);
  border-radius: 6px;
  border: 3px solid rgb(220, 209, 223);
}
</style>
