<template>
  <div>
    <v-card class="mb-3">
      <v-card-title>Spotify ID</v-card-title>
      <v-card-subtitle>
        <v-tooltip right color="black">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon
                color="primary"
              >
                mdi-help-circle-outline
              </v-icon>
            </v-btn>
          </template>
          <span>
            <p>
              <strong>Desktop App:</strong>
            </p>
            <ol>
              <li>Find your public artist page on Spotify</li>
              <li>
                Click the
                <img src="/img/spotify-dot.png" width="25px" alt="spotify dot" loading="lazy" /> icon that appears below your artist name
              </li>
              <li>When the menu appears, choose Share > Copy Spotify URI</li>
              <li>When you paste the Spotify URI, remove the “spotify:artist:” text at the beginning of the string</li>
              <li>The remaining combination of numbers and letters is your Spotify artist ID</li>
            </ol>
            <p>
              <strong>Web App</strong>
            </p>
            <ol>
              <li>Open the Spotify Web Player and find your artist page</li>
              <li>Check the artist’s URL</li>
              <li>
                The page URL will start with "https://open.spotify.com/artist/" the number that appears after that is the artist ID:
                <br />
                <img src="/img/Spotify-ID-URL.png" width="300px" alt="spotify id url image" loading="lazy" />
              </li>
            </ol>
          </span>
        </v-tooltip>
        How do I find my ID?
      </v-card-subtitle>
      <v-card-text>
        <v-row class="justify-content-center">
          <v-col cols="12">
            <v-form id="input-group-2" class="form-group">
              <div>
                <v-text-field
                  id="input-2"
                  v-model="artistId"
                  placeholder="Artist ID"
                  @keydown.enter="onSubmitArtistId"
                />
              </div>
              <div v-if="error" class="invalid-feedback">{{ error }}</div>
            </v-form>
            <v-btn color="primary" dark @click="onSubmitArtistId" :loading="processing">Add Spotify ID</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data: function () {
    return {
      processing: false,
      enterArtistId: false,
      artistId: this.settings.account.spotify.spotify_artist_id,
      error: null
    }
  },
  props: {
    settings: Object
  },
  computed: {
    ...mapState({
      spotify_enabled: state => state.setProfile.user_profile.spotify_enabled
    })
  },
  created: function () {
    if (this.spotify_enabled) {
      this.enterArtistId = true
    }
  },
  methods: {
    ...mapActions({
      setSpotifyArtist: 'setSpotifyArtist'
    }),
    onSubmitArtistId: function () {
      this.processing = true
      this.setSpotifyArtist(this.artistId)
        .catch(() => {
          this.error = 'Invalid Spotify Artist ID input!'
        })
        .finally(() => this.processing = false)
    }
  }
}
</script>

<style scoped>
.invalid-feedback {
  display: block;
}

label {
  margin-right: 10px;
}
</style>
