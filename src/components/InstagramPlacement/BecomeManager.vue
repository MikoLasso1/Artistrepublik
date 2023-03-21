<template>
  <div class="instagrammanage">
    <v-card class="instagrammanage-card">
      <v-card-title>
        <h2 class="instagrammanage-heading">List Your Account</h2>
      </v-card-title>
      <v-card-subtitle>
        Promote Other Brands and Make Money
      </v-card-subtitle>
      <v-card-actions class="justify-center">
        <picture>
          <source srcset="/img/instagram-placement/widget_sm.webp" type="image/webp">
          <img src="/img/instagram-placement/widget_sm.png" alt="camera" loading="lazy" />
        </picture>
      </v-card-actions>
      <v-card-text class="text-center">
        <h3 class="instagrammanage-description-heading">List Your Instagram!</h3>
        <p class="instagrammanage-description">List your Instagram account to discover new music and make money.</p>
        <v-btn color="success" @click="openBecomeManagerModal">Submit Your Instagram</v-btn>
      </v-card-text>
    </v-card>
    <become-manager-modal ref="modal" />
  </div>
</template>

<script>
import BecomeManagerModal from '@/components/InstagramPlacement/BecomeManagerModal'

export default {
  components: {
    BecomeManagerModal
  },
  methods: {
    openBecomeManagerModal: function () {
      this.$refs.modal.openModal()
    }
  }
}
</script>

<style>
.instagrammanage,
.instagrammanage-card {
  height: 100%;
}

.instagrammanage-heading {
  margin: 0;
}

.instagrammanage-description-heading {
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 1.25rem;
}

.instagrammanage-description {
  text-transform: uppercase;
  font-family: "Montserrat-Light", sans-serif;
  font-size: 0.9rem;
}
</style>
