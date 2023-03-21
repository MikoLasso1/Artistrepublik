<template>
  <div class="instagramorder">
    <v-card class="instagramorder-card card">
      <v-card-title>
        <h2 class="instagramorder-heading">Instagram Placement</h2>
      </v-card-title>
      <v-card-subtitle>
        Grow Your Brand and Name Recognition
      </v-card-subtitle>
      <v-card-actions class="justify-center instagramorder-card-actions">
        <picture>
          <source srcset="/img/instagram-placement/widget_sm.webp" type="image/webp">
          <img src="/img/instagram-placement/widget_sm.png" alt="camera" loading="lazy" />
        </picture>
      </v-card-actions>
      <v-card-text class="text-center">
        <h3 class="instagramorder-description-heading">Get Your Music and Posts Shared!</h3>
        <p class="instagramorder-description">Get your music/post shared to over 10,000,000 followers across the world!</p>
        <v-btn color="success" @click="openOrderModal">Submit for Placement</v-btn>
      </v-card-text>
    </v-card>
    <order-modal ref="modal" />
  </div>
</template>

<script>
import OrderModal from '@/components/InstagramPlacement/OrderModal'

export default {
  components: {
    OrderModal
  },
  methods: {
    openOrderModal: function () {
      this.$refs.modal.openModal()
    }
  },
  mounted: function () {
    if (this.$route.query.tool === 'ig-placement') {
      this.$refs.modal.openModal()
    }
  }
}
</script>

<style>
.instagramorder,
.instagramorder-card {
  height: 100%;
}

.instagramorder-card {
  justify-content: space-between;
}

.instagramorder-heading {
  margin: 0;
}

.instagramorder-description-heading {
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 1.25rem;
}

.instagramorder-description {
  text-transform: uppercase;
  font-family: "Montserrat-Light", sans-serif;
  font-size: 0.9rem;
}

.instagramorder-card-actions {
  min-height: 123px;
}
</style>
