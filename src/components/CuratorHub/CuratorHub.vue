<template>
  <v-card class="submissionhub-card">
    <v-card-title>
      <h2 class="submissionhub-heading">Spotify Playlist Submission Hub</h2>
    </v-card-title>
    <v-card-subtitle>
      Grow Streams and Placements
    </v-card-subtitle>
    <v-card-actions>
      <CuratorSlider />
    </v-card-actions>
    <v-card-text class="text-center">
      <h3 class="submissionhub-description-heading">Get Your Music in Front of Playlist Curators!</h3>
      <p class="submissionhub-description">Get your music heard through playlists, blogs and influencers.</p>
      <v-btn
        @click="showCuratorOrderModal"
        color="success"
      >
        Submit Your Music
      </v-btn>
    </v-card-text>
    <curator-order-modal ref="curatorOrderModal" :cart-key="cartKey" />
  </v-card>
</template>
<script>
import CuratorOrderModal from '@/components/CuratorHub/CuratorOrderModal'
import CuratorSlider from '@/components/CuratorHub/CuratorSlider'

export default {
  components: {
    CuratorOrderModal,
    CuratorSlider
  },
  data: function () {
    return {
      cartKey: null
    }
  },
  methods: {
    showCuratorOrderModal: function () {
      this.$refs.curatorOrderModal.openCuratorModal()
    }
  },
  mounted: function () {
    if (this.$route.query.tool === 'curator') {
      this.$refs.curatorOrderModal.openCuratorModal()
    }
  },
  created: function () {
    if (this.isCartPresent() && this.$route.query.tool === 'curator') {
      this.cartKey = this.$route.query.cart_key
    }
  }
}
</script>

<style scoped>
.submissionhub-card {
  height: 100%;
}

.submissionhub-heading {
  margin: 0;
  word-break: break-word;
}

.submissionhub-description-heading {
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 1.25rem;
}

.submissionhub-description {
  text-transform: uppercase;
  font-family: "Montserrat-Light", sans-serif;
  font-size: 0.9rem;
}
</style>
