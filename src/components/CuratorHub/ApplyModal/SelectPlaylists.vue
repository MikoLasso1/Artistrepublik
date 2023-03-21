<template>
  <div>
    <v-row>
      <v-col cols="9">
        <p>
          Select your playlists in which you want people to apply to be on.<br>
          Your playlist must have at least <strong> 100 followers</strong> to show up in the list below.
        </p>
      </v-col>
      <v-col cols="3">
        Max Price: <strong>${{ defaultPrice }}.00</strong>
      </v-col>
    </v-row>
    <p
      v-if="savedStatus === true"
      class="alert alert-success"
    >
      <strong>Saved!</strong> Your selected curator playlists have been updated.
    </p>
    <h3>Spotify Playlists</h3>
    <spotify-playlist
      v-for="playlist in spotify_playlists"
      :key="playlist.spotify_playlist_id"
      :playlist="playlist"
      :genres="genres"
      :is-selected="isPlaylistSelected(playlist.spotify_playlist_id)"
      :default-price="defaultPrice"
      :current-price="getCurrentPlaylistPrice(playlist.spotify_playlist_id)"
      @toggle-playlist="togglePlaylist"
      @price-change="onPriceChange"
      @toggle-save-button="validateSelectedPlaylists"
      @genre-change="onGenreChange"
    />
    <v-btn
      class="my-2"
      color="primary"
      :disabled="saveIsDisabled"
      @click="save"
    >
      Save
    </v-btn>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import SpotifyPlaylist from './SpotifyPlaylist'
import _ from 'lodash'

export default {
  components: {
    SpotifyPlaylist,
  },
  props: {
    defaultPrice: Number,
  },
  data: function () {
    return {
      selectedPlaylistValidations: [],
      spotify_playlists: [],
      currently_selected_playlists: {},
      savedStatus: false,
      selectedPlaylistsCount: 0,
    }
  },
  computed: {
    ...mapGetters({
      genres: 'CuratorGenres/getGenres',
    }),
    invalidPlaylists: function () {
      return _.filter(this.selectedPlaylistValidations, function (playlist) {
        return (playlist.isValid === false)
      })
    },

    saveIsDisabled: function () {
      return (this.invalidPlaylists.length > 0)
    },
  },
  watch: {
    selectedPlaylistValidations: {
      deep: true,
      handler: function () {
        // let count = 0
        //
        // for (const playlistId in this.currently_selected_playlists) {
        //   console.log(playlistId)
        //   count++
        // }
        this.selectedPlaylistsCount = this.currently_selected_playlists.length
      },
    },
  },
  methods: {
    ...mapActions({
      getGenres: 'CuratorGenres/getGenres',
    }),
    isPlaylistSelected: function (id) {
      return (id in this.currently_selected_playlists)
    },
    getCurrentPlaylistPrice: function (id) {
      if (id in this.currently_selected_playlists) {
        return this.currently_selected_playlists[id].price
      }
      return null
    },
    togglePlaylist: function (id, data) {
      if (id in this.currently_selected_playlists) {
        delete this.currently_selected_playlists[id]
      } else {
        this.currently_selected_playlists[id] = data
      }
    },
    validateSelectedPlaylists: function (playlistId, isValid) {
      let selectedPlaylistValidations = this.selectedPlaylistValidations

      _.remove(selectedPlaylistValidations, { 'id': playlistId })
      selectedPlaylistValidations.push({
        id: playlistId,
        isValid: isValid,
      })
      this.$set(this, 'selectedPlaylistValidations', selectedPlaylistValidations)
    },
    onPriceChange: function (id, price) {
      if (id in this.currently_selected_playlists) {
        this.currently_selected_playlists[id].price = parseFloat(price) ? parseFloat(price) : null
      }
    },
    onGenreChange: function (id, genres) {
      if (id in this.currently_selected_playlists) {
        this.currently_selected_playlists[id].genres = genres
      }
    },
    setCurrentlySelectedPlaylists: function (playlists) {
      this.currently_selected_playlists = playlists.reduce((accum, val) => {
        accum[val.spotify_playlist_id] = { price: val.price, genres: val.genres }
        return accum
      }, {})
    },
    save: async function () {
      let selected = []
      for (const id in this.currently_selected_playlists) {
        let playlist = this.spotify_playlists.filter(v => v.spotify_playlist_id === id)[0]
        if (playlist) {
          playlist.price = this.currently_selected_playlists[id].price
          selected.push(playlist)
        }
      }

      try {
        let { data: { data } } = await Vue.$http.post('v1/service/playlist-republik/playlist', { selected })
        this.setCurrentlySelectedPlaylists(data)
        this.savedStatus = true
        this.$emit('saved')
        this.$store.dispatch('fetchSettings')
      } catch (err) {
        this.throwError(err)
      }
    },
  },
  created: async function () {
    if (this.genres.length === 0) {
      await this.getGenres()
    }
    const { data: { data } } = await Vue.$http.get('v1/service/playlist-republik/playlist')
    this.setCurrentlySelectedPlaylists(data)
    const response = await Vue.$http.get('v1/spotify/playlist?public=1&followersMin=100')
    this.spotify_playlists = response.data.data
  },
}
</script>

<style scoped>

</style>
