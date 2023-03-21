<template>
  <div id="spotify">
    <card
      shadow
      type="secondary"
      class="mb-2"
    >
      <template>
        <h2 class="h6 heading-small text-muted mb-4">
          Spotify
        </h2>
        <div class="pl-lg-4">
          <div class="row">
            <div class="col-12">
              <div
                v-if="status"
                class="alert"
                :class="'alert-' + status"
              >
                {{ message }}
              </div>
              <a
                v-if="authorized === false"
                :href="spotifyConnectUrl"
              >
                <v-btn
                  dark
                  color="blue"
                  type="info"
                  icon="mdi mdi-spotify"
                >
                  <v-icon>fa-spotify</v-icon>
                  Link Spotify Account
                </v-btn>
              </a>
              <v-btn
                dark
                color="success"
                v-else-if="authorized === true"
                type="success"
                icon="mdi mdi-spotify"
              >
                <v-icon>fa-spotify</v-icon>
                Spotify Account Linked
              </v-btn>
            </div>
            <div
              v-if="authorized"
              class="col-12 mt-2"
            >
              <v-btn
                dark
                color="success"
                type="success"
                @click="updateSpotify"
              >
                <v-icon>fa-spotify</v-icon>
                Update Spotify Account Information
              </v-btn>
            </div>
          </div>
        </div>
      </template>
    </card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Vue from 'vue'
import config from '../../config'

export default {
  data: function () {
    return {
      status: null,
      message: ''
    }
  },
  computed: {
    ...mapGetters({
      authorized: 'getSpotifyAccessStatus'
    }),
    spotifyConnectUrl: function () {
      return `https://accounts.spotify.com/authorize?client_id=${config.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${config.APP_URL}settings?token_type=spotify&scope=user-read-email%20playlist-read-collaborative%20playlist-modify-public%20user-follow-read`
    }
  },
  created: function () {
    this.$store.dispatch('checkSpotifyAccessStatus')
    if (this.$route.query.code && this.$route.query.token_type && this.$route.query.token_type === 'spotify') {
      this.$store.dispatch('setSpotifyAccessCode', this.$route.query.code)
        .then(() => {
          this.status = 'success'
          this.message = 'You have successfully linked your Spotify account!'
        })
        .catch(() => {
          this.status = 'danger'
          this.message = 'An error has occurred, try again.'
        })
    }
  },
  methods: {
    updateSpotify: function () {
      Vue.$http.get('v1/spotify/refresh')
        .then(() => {
          this.status = 'success'
          this.message = 'Spotify Account Updated'
          //TODO show something
        })
        .catch(error => console.log(error))
    }
  }
}
</script>
