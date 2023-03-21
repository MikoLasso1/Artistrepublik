<template>
  <div class="h-100 soundstore-layout">
    <audio-player />
    <router-view class="soundstore-views"></router-view>
    <beat-pricing-modal ref="beatPricingModal" />
    <beat-offer-modal ref="beatOfferModal" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AudioPlayer from '@/components/SoundStore/AudioPlayer'
import BeatPricingModal from '@/components/SoundStore/BeatPricingModal'
import BeatOfferModal from '@/components/SoundStore/BeatOfferModal'

export default {
  components: {
    AudioPlayer,
    BeatPricingModal,
    BeatOfferModal
  },
  computed: {
    ...mapGetters({
      beatPricingModalVisible: 'SSBeatPricingModal/getVisible',
      beatOfferModalVisible: 'SSBeatOfferModal/getVisible',
      loggedIn: 'isAuthenticated',
      favoritesLoaded: 'SSFavorites/getLoaded'
    })
  },
  watch: {
    beatPricingModalVisible: function (visible) {
      if (visible) {
        this.$refs.beatPricingModal.openModal()
      }
    },
    beatOfferModalVisible: function (visible) {
      if (visible) {
        this.$refs.beatOfferModal.openModal()
      }
    }
  },
  methods: {
    ...mapActions({
      fetchFavorites: 'SSFavorites/fetchFavorites'
    })
  },
  created: function () {
    if (!this.favoritesLoaded && this.loggedIn) {
      this.fetchFavorites()
    }
  }
}
</script>

<style>
.soundstore-layout {
  background-color: #212529;
}

.soundstore-views {
  background-color: #fff;
}
</style>
