<template>
  <div>
    <h3 class="h3">Spotify</h3>
    <v-alert v-model="alert" :type="messageType" dismissible>{{
        message
      }}
    </v-alert>
    <v-btn
      v-if="spotifyEnabled"
      color="green"
      dark
      min-width="100%"
      class="mb-2"
      @click="updateSpotify"
    >
      Update Spotify Stats
    </v-btn>
    <v-progress-circular
      v-if="loading"
      indeterminate
      color="primary"
      style="margin-left: 30px"
    ></v-progress-circular>
    <v-btn
      v-if="!spotifyEnabled && !loading"
      color="primary"
      min-width="100%"
      @click="goToSpotify"
    >
      <v-icon left dark>mdi-spotify</v-icon>
      Connect Spotify
    </v-btn>
    <v-dialog
      v-if="spotifyEnabled && !loading"
      v-model="confirmationAlert"
      max-width="290"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="red" dark min-width="100%" v-bind="attrs" v-on="on">
          Disconnect Spotify
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">Disconnect Spotify?</v-card-title>
        <v-card-text
        >Are you sure you want to disconnect your spotify
          account?
        </v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1" text @click="confirmationAlert = false"
          >Cancel
          </v-btn
          >
          <v-btn color="red darken-1" text @click="doDisconnect">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Vue from 'vue'
import config from '../../../config'

export default {
  props: {
    spotifyEnabled: Boolean,
    settings: Object,
  },
  data: function () {
    return {
      alert: false,
      messageType: 'success',
      message: '',
      confirmationAlert: false,
      loading: false,
    }
  },
  computed: {
    ...mapGetters({
      user: 'getUser',
    }),
  },
  methods: {
    ...mapActions({
      fetchSettings: 'fetchSettings',
    }),
    goToSpotify: async function () {
      window.localStorage.setItem('code_type', 'spotify')
      window.localStorage.setItem('spotify_redirect', 'settings')
      let { data: { data } } = await Vue.$http.get(`v1/spotify/access/url?url=${config.APP_URL}connect_spotify?token_type=spotify`)
      window.location = data.url
    },
    updateSpotify: async function () {
      try {
        await Vue.$http.get('v1/spotify/refresh')
        this.messageType = 'success'
        this.message = 'Spotify Account Updated!'
      } catch (err) {
        console.error(err)
        this.messageType = 'error'
        this.message = 'An uknown error has occured!'
      }
      this.alert = true
    },
    doDisconnect: async function () {
      await Vue.$http.delete('v1/spotify/access')
      await this.fetchSettings()
      this.confirmationAlert = false
    },
    loadSettings () {
      this.fetchSettings().then((data) => {
        if (data.account.spotify.spotify_enabled) {
          this.loading = false
        }
      })
    },
    listenForSpotifyConnection () {
      window.Echo.private(`spotify-finished.${this.user.id}`).listen(
        '.SpotifyFinished',
        () => {
          this.loadSettings()
        },
      )
    },
  },
  created: async function () {
    if (this.$route.query.code && window.localStorage.getItem('code_type') === 'spotify') {
      this.listenForSpotifyConnection()
      this.loading = true
      try {
        await Vue.$http.post('v1/spotify/access', { code: this.$route.query.code })
        this.messageType = 'success'
        this.message = 'Spotify Account Linked!'
        this.alert = true
        this.loadSettings()
        window.localStorage.removeItem('code_type')
      } catch (err) {
        this.messageType = 'error'
        this.message = 'An unknown error has occurred!'
      }
    }
  },
}
</script>

<style>
</style>
