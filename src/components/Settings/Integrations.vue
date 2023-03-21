<template>
  <v-card>
    <v-card-title>Integrations</v-card-title>
    <v-card-text>
      <stripe class="mb-4" :stripe-enabled="settings.account.payments.stripe_enabled" />
      <spotify class="mb-4" :settings="settings" :spotify-enabled="settings.account.spotify.spotify_enabled" />
      <instagram :instagram-enabled="settings.account.instagram.instagram_enabled" />
    </v-card-text>
  </v-card>
</template>

<script>
import Stripe from '@/components/Settings/Integrations/Stripe'
import Spotify from '@/components/Settings/Integrations/Spotify'
import Instagram from '@/components/Settings/Integrations/Instagram'

export default {
  components: {
    Stripe,
    Spotify,
    Instagram
  },
  props: {
    settings: Object
  }
}
</script>

<style>

</style>
