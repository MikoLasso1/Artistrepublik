<template>
  <div>
    <v-dialog id="curator-apply-modal" v-model="curatorDialog" max-width="850">
      <v-card>
        <v-card-title>
          <h2 v-if="step === 1" class="h2 mb-0">Become a Curator</h2>
          <h2 v-if="step === 2" class="h2 mb-0">Select Playlists</h2>
          <v-spacer />
          <v-btn text @click="onHideCuratorModal">
            <v-icon> mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-subtitle> Curator</v-card-subtitle>
        <v-card-text ref="applyCuratorSection">
          <div v-if="!spotify_access" class="mx-auto">
            <v-btn color="primary" class="mb-3" @click="goToSpotify">
              <v-icon left dark>mdi-spotify</v-icon>
              Connect Spotify
              <br />
            </v-btn>
            <p>You will be redirected to Spotify Login Page</p>
          </div>
          <div v-else>
            <features-terms-and-conditions
              v-if="step === 1"
              :error="error"
              @next-step="onNextStep"
              @curator-created="onCuratorCreated"
            />
            <select-playlists
              v-if="step === 2"
              :default-price="price"
              @next-step="onNextStep"
              @back-step="onBackStep"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import config from '../../config'
import FeaturesTermsAndConditions from '@/components/CuratorHub/ApplyModal/FeaturesTermsAndConditions'
import SelectPlaylists from '@/components/CuratorHub/ApplyModal/SelectPlaylists'

export default {
  components: {
    FeaturesTermsAndConditions,
    SelectPlaylists
  },
  data: function () {
    return {
      curatorDialog: false,
      // step: 0,
      step: 1,
      price: 0.5,
      error: null
    }
  },
  computed: {
    ...mapGetters({
      spotify_access: 'getSpotifyAccessStatus'
    })
  },
  created () {
    this.$store.dispatch('checkSpotifyAccessStatus').then(() => {
      console.log('done')
    })
    //TODO show loading until this is done
    Vue.$http
      .get('v1/service/playlist-republik/curator/is-curator')
      .then((response) => {
        if (response.data.data.is_curator) {
          this.price = response.data.data.price
          this.step = 2
        }
      })
      .catch((err) => this.$sentry.captureException(err))
  },
  methods: {
    goToSpotify: async function () {
      // let spotifyConnectUrl = `https://accounts.spotify.com/authorize?client_id=${config.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${config.APP_URL}connect_spotify?token_type=spotify&scope=user-read-email%20playlist-read-collaborative%20playlist-modify-private%20playlist-modify-public%20user-follow-read`;
      // window.localStorage.setItem('code_type', 'spotify');
      // window.localStorage.setItem('spotify_redirect', this.$route.name);
      // window.location = spotifyConnectUrl;
      window.localStorage.setItem('code_type', 'spotify')
      window.localStorage.setItem('spotify_redirect', 'settings')
      let {
        data: { data }
      } = await Vue.$http.get(
        // TODO The url may be null here - ARD-1819
        `v1/spotify/access/url?url=${config.APP_URL}connect_spotify?token_type=spotify`
      )
      window.location = data.url
    },
    onNextStep: async function () {
      if (this.step === 2) {
        await this.$store.dispatch('fetchSettings')
      }
      this.step++
    },
    onBackStep: function () {
      this.step--
    },
    onCuratorCreated: function (curator) {
      this.price = curator.price
    },
    openCuratorModal () {
      this.curatorDialog = true
    },
    onHideCuratorModal () {
      this.curatorDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  border: none;
}
</style>
