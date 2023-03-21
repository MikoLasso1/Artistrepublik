<template>
  <v-card>
    <v-card-title>Spotify Follow Button</v-card-title>
    <v-card-subtitle></v-card-subtitle>
    <v-card-text class="mt-4">
      <div class="mb-4">
        <v-alert
          prominent
          type="info"
          v-if="!isSpotifyEnabled"
        >
          <v-row align="center">
            <v-col class="grow">
              You have not connected your spotify account. Please connect your spotify account below.
            </v-col>
          </v-row>
        </v-alert>
        <v-row v-else>
          <v-col v-if="!isComponentAddedToLayout">
            <MiniProfileAddComponent :component-name="$options.name" />
          </v-col>
          <v-col v-else>
            <h3 class="text-center">Added to layout.</h3>
          </v-col>
        </v-row>
        <spotify-connect :settings="userSettings" class="my-4" />
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import MiniProfileAddComponent from '@/components/MiniProfile/views/MiniProfileAddComponent'
import SpotifyConnect from '@/components/Spotify/SpotifyAPI'

export default {
  name: 'MiniProfileSpotifyFollowButtonView',
  components: {
    MiniProfileAddComponent,
    SpotifyConnect
  },
  data () {
    return {}
  },

  methods: {
    connectSpotify () {
      this.$router.push({ name: 'settings' })
    }
  },
  created () {
  },
  computed: {
    ...mapGetters({
      liveLayoutData: 'MiniProfile/getLiveLayoutData',
      userSettings: 'getSettings'
    }),
    isComponentAddedToLayout () {
      let componentName = this.$options.name
      let result = this.liveLayoutData.filter(
        v => v.component === componentName
      )
      return result.length ? result[0].componentFE : false
    },
    isSpotifyEnabled () {
      return this.userSettings.account.spotify.spotify_enabled
    }
  }
}
</script>
