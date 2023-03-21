<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="600"
      v-if="upsellSuccess"
      elevation="0"
    >
      <v-card-text class="text-center">
        <h3 class="mt-5">
          <v-icon
            color="green"
            large
            left
          >
            mdi-check-circle-outline
          </v-icon>
        </h3>
        <h1>Thank you for your purchase!</h1>
        <h3 class="mb-5">Your song has been sent to the playlist owners for review. Stay tuned to your email for updates!</h3>
        <p>Please allow 1 - 4 business days for your selected Curator to review each of your submissions to their playlists. If your submission is approved, the Curator may take up to 7 days to add
          your submission to their playlist.</p>
      </v-card-text>
    </v-card>
    <v-alert
      text
      type="success"
      v-else
    >Your song has been sent to the playlist owners for review. Stay tuned to your email for updates!
    </v-alert>
  </div>
</template>

<script>
export default {
  props: {
    upsellSuccess: {
      default: false,
      type: Boolean
    }
  }
}
</script>
<style scoped>
.success--text {
  color: #4caf50 !important;
  caret-color: #4caf50 !important;
}

.v-alert__icon {
  margin-right: 16px;
}
</style>
