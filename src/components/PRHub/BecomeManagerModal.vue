<template>
  <v-dialog
    id="become-manager-modal"
    v-model="show"
    max-width="850"
  >
    <v-card>
      <v-card-title>
        <h2 class="m-0" v-if="step === 1">Become a Blog Promotion Manager</h2>
        <h2 class="m-0" v-if="step === 2">Outlets</h2>
        <v-spacer />
        <v-btn text @click="closeModal">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-subtitle>
        Blog Promotion Manager
      </v-card-subtitle>
      <v-card-text>
        <features-terms-and-conditions v-if="step === 1" v-on:next-step="onNextStep"></features-terms-and-conditions>
        <outlets v-else-if="step === 2"></outlets>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import FeaturesTermsAndConditions from '@/components/PRHub/BecomeManagerModal/FeaturesTermsAndConditions'
import Outlets from '@/components/PRHub/BecomeManagerModal/Outlets'

export default {
  components: {
    FeaturesTermsAndConditions,
    Outlets
  },
  data: function () {
    return {
      show: false,
      step: 1
    }
  },
  computed: {
    ...mapGetters({
      is_manager: 'getIsPressReleaseManager'
    })
  },
  methods: {
    openModal: function () {
      this.show = true
      this.onOpen()
    },
    closeModal () {
      this.show = false
      this.$store.dispatch('fetchSettings')
    },
    onOpen: function () {
      this.step = 1
      if (this.is_manager) {
        this.step = 2
      }
    },
    onNextStep: function () {
      this.step++
    },
    onBackStep: function () {
      this.step--
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
