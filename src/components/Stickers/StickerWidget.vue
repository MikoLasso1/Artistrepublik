<template>
  <div class="stickerwidget">
    <v-card class="stickerwidget-card">
      <v-card-title>
        <h2 class="stickerwidget-heading">Custom Stickers</h2>
      </v-card-title>
      <v-card-subtitle>
        Promote Your Brand
      </v-card-subtitle>
      <v-card-actions class="justify-center">
        <picture>
          <source srcset="/img/dashboard/sticker_icon.webp" type="image/webp">
          <img src="/img/dashboard/sticker_icon.png" width="100" alt="Custom Stickers" loading="lazy" />
        </picture>
      </v-card-actions>
      <v-card-text class="text-center">
        <h3 class="stickerwidget-description-heading">Custom Stickers Starting at $5!</h3>
        <p class="stickerwidget-description">High quality custom stickers at an affordable cost.</p>
        <v-btn id="start_button" disabled color="success" @click="showModal">*Coming Soon*</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'StickerWidget',
  data () {
    return {
      show: false
    }
  },
  methods: {
    showModal: function () {
      this.show = !this.show
    },
    hideModal: function () {
      this.show = false
    }
  }
}
</script>
<style>
.stickerwidget,
.stickerwidget-card {
  height: 100%;
}

.stickerwidget-heading {
  margin: 0;
}

.stickerwidget-description-heading {
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 1.25rem;
}

.stickerwidget-description {
  text-transform: uppercase;
  font-family: "Montserrat-Light", sans-serif;
  font-size: 0.9rem;
}
</style>
