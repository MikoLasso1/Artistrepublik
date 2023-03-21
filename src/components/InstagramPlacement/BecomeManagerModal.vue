<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title class="headline">List your Instagram account</v-card-title>
      <div v-if="!user_instagram.instagram_username" class="py-4 text-center">
        <p class="body-1">You need to connect your instagram account</p>
        <v-btn to="/settings" dark color="#e4405f">
          <v-icon left dark>mdi-instagram</v-icon>
          Connect Instagram
        </v-btn>
        <p class="caption">You will be redirecting to the settings page</p>
      </div>
      <div class="px-6 pb-4" v-else>
        <features-terms-and-conditions v-if="step === 1" @manager-created="onManagerCreated" @next-step="onNextStep" />
        <update-placement-profile v-else-if="step === 2" :manager-id="instagram_placement_manager_id" @close-modal="onCloseModal" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import FeaturesTermsAndConditions from '@/components/InstagramPlacement/BecomeManagerModal/FeaturesTermsAndConditions'
import UpdatePlacementProfile from '@/components/InstagramPlacement/BecomeManagerModal/UpdatePlacementProfile'

export default {
  components: {
    FeaturesTermsAndConditions,
    UpdatePlacementProfile
  },
  data: function () {
    return {
      dialog: false,
      step: 1,
      instagram_placement_manager_id: null
    }
  },
  computed: {
    ...mapGetters({
      user_instagram: 'getInstagram',
      instagram_placement_manager: 'getInstagramPlacementAccount'
    })
  },
  methods: {
    openModal: function () {
      this.dialog = true
    },
    onNextStep: function () {
      this.step++
    },
    onBackStep: function () {
      this.step--
    },
    onManagerCreated: function (instagram_placement_manager) {
      this.instagram_placement_manager_id = instagram_placement_manager.id
    },
    onCloseModal: function () {
      this.dialog = false
    }
  },
  mounted: function () {
    if (this.instagram_placement_manager.is_account && !this.instagram_placement_manager.is_banned) {
      this.instagram_placement_manager_id = this.instagram_placement_manager.id
      this.step = 2
    }
  }
}
</script>

<style>

</style>
