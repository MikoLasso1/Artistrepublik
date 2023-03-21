<template>
  <div>
    <v-dialog
      v-model="show"
      id="pr-order-modal"
      max-width="850"
    >
      <v-card>
        <v-card-title>
          <h2 class="m-0" v-if="step === 1">Terms and Conditions</h2>
          <h2 class="m-0" v-if="step === 2">Outlets</h2>
          <h2 class="m-0" v-if="step === 3">Draft</h2>
          <h2 class="m-0" v-if="step === 4">Links</h2>
          <h2 class="m-0" v-if="step === 5">Checkout</h2>
          <v-spacer />
          <v-btn text @click="closeModal">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle>
          Blog Promotion
        </v-card-subtitle>
        <v-card-text ref="prOrderModal">
          <step-progress-bar
            :active-step="step"
            :steps="[
              {icon: 'city', title: 'Terms'},
              {icon: 'book-open-variant', title: 'Outlets'},
              {icon: 'file-document-outline', title: 'Draft'},
              {icon: 'link-variant', title: 'Links'},
              {icon: 'currency-usd', title: 'Pay'}
            ]"
          />
          <features-terms-and-conditions v-if="step === 1" v-on:next-step="onNextStep"></features-terms-and-conditions>
          <select-outlets v-if="step === 2" v-on:next-step="onNextStep"></select-outlets>
          <draft v-if="step === 3" v-on:next-step="onNextStep" v-on:back-step="onBackStep" :press-release="pressRelease" v-on:press-release-created="onPressReleaseCreated"></draft>
          <links v-if="step === 4" v-on:next-step="onNextStep" v-on:back-step="onBackStep" :press-release="pressRelease" v-on:set-links="onSetLinks"></links>
          <checkout v-if="step === 5" v-on:back-step="onBackStep" :press-release="pressRelease"></checkout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import StepProgressBar from '@/components/StepProgressBar'
import FeaturesTermsAndConditions from '@/components/PRHub/PROrderModal/FeaturesTermsAndConditions'
import SelectOutlets from '@/components/PRHub/PROrderModal/SelectOutlets'
import Draft from '@/components/PRHub/PROrderModal/Draft'
import Links from '@/components/PRHub/PROrderModal/Links'
import Checkout from '@/components/PRHub/PROrderModal/Checkout'

export default {
  components: {
    StepProgressBar,
    FeaturesTermsAndConditions,
    SelectOutlets,
    Draft,
    Links,
    Checkout
  },
  data: function () {
    return {
      show: false,
      step: 1,
      pressRelease: null
    }
  },
  methods: {
    openModal () {
      this.show = true
    },
    closeModal () {
      this.show = false
      this.$store.commit('setIntent', null)
    },
    onNextStep: function () {
      this.step++
      this.modalScrollTop()
    },
    onBackStep: function () {
      this.step--
      this.modalScrollTop()
    },
    modalScrollTop: function () {
      this.$refs.prOrderModal.scrollIntoView()
    },
    onPressReleaseCreated: function (pressRelease) {
      this.pressRelease = pressRelease
    },
    onSetLinks: function (links) {
      this.pressRelease.links = links
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  border: none;
  box-shadow: none !important;
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
