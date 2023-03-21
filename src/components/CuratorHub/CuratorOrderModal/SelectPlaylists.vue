<template>
  <div>
    <v-row class="my-2 sticky-top top-filter-bar">
      <div class="col-md-6 text-left">
        <playlists-filters @filtered="onFiltered" :track="track" />
      </div>
      <div class="col-md-6 text-right">
        <cart @checkout="doCheckout" />
      </div>
    </v-row>
    <v-row class="my-2">
      <v-col>
        <p class="playlist-select-text">* To improve your chances of being accepted unto a playlist, carefully review the genres of each playlist and apply to those that align with your genre.</p>
        <div
          id="playlist-wrap"
          ref="playlists"
        >
          <playlist
            v-for="playlist in playlists"
            :is-selected="selectedIds.indexOf(playlist.id) === -1 ? false : true"
            :key="playlist.id"
            :playlist="playlist"
            @toggle-selected="toggleSelectedPlaylists"
          />
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex">
        <v-btn
          dark
          color="error"
          @click="doBack"
        >
          Back
        </v-btn>
        <v-spacer />
        <v-btn
          dark
          color="success"
          @click="doCheckout"
        >
          Next
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue'
import PlaylistsFilters from '@/components/CuratorHub/CuratorOrderModal/PlaylistsFilters'
import Cart from '@/components/CuratorHub/CuratorOrderModal/Cart'
import Playlist from '@/components/CuratorHub/CuratorOrderModal/Playlist'
import { mapGetters } from 'vuex'

export default {
  components: {
    PlaylistsFilters,
    Cart,
    Playlist,
  },
  props: {
    track: Object,
    cartKey: String,
  },
  data: function () {
    return {
      filters: '',
      playlists: [],
      selectedIds: [],
      currentPage: 0,
      lastPage: 1,
      fetching: false,
    }
  },
  computed: {
    ...mapGetters({
      cartPlaylists: 'getCuratorOrderCart',
    }),
  },
  watch: {
    filters: function () {
      this.currentPage = 0
      this.fetchPlaylists(true)
    },
  },
  created: function () {
    if (this.cartPlaylists.length > 0) {
      this.selectedIds = this.cartPlaylists.reduce((accum, v) => {
        accum.push(v.id)
        return accum
      }, [])
    }
    this.filters = `genres=${this.track.genre_id}`
    this.fetchPlaylists()
    this.$store.dispatch('updateIntentStep', 'select playlists')
  },
  mounted: function () {
    this.$refs.playlists.addEventListener('scroll', this.onPlaylistScroll)
  },
  methods: {
    doBack: function () {
      this.$emit('back-step')
    },
    onFiltered: function (filters) {
      if (this.filters !== filters) {
        this.filters = filters
      }
    },
    fetchPlaylists: function (removePlaylists = false) {
      if (this.currentPage === this.lastPage || this.fetching) {
        return
      }
      if (removePlaylists) {
        this.playlists = []
      }
      this.currentPage = this.currentPage + 1
      this.fetching = true

      Vue.$http
        .get(
          `v1/service/playlist-republik/curator/playlist/playlists?page=${this.currentPage}${this.filters ? '&' + this.filters : ''
          }`,
          {
            params: {
              exclude_user_playlists: true
            },
          },
        )
        .then(response => {
          this.playlists = this.playlists.concat(response.data.data)
          this.lastPage = response.data.meta.last_page
          this.fetching = false
        })
        .catch(err => this.$sentry.captureException(err))
    },
    toggleSelectedPlaylists: function (id) {
      let index = this.selectedIds.indexOf(id)
      let playlist = this.playlists.filter(v => v.id === id)[0]
      if (index !== -1) {
        this.selectedIds.splice(index, 1)
        this.$store.commit('removePlaylistFromCart', playlist)
      } else {
        this.selectedIds.push(id)
        this.$store.commit('addPlaylistToCart', playlist)
      }
    },
    doCheckout: async function () {
      let selectedIds = this.cartPlaylists.reduce((accum, v) => {
        accum.push(v.id)
        return accum
      }, [])
      let data = { items: selectedIds }
      try {
        await Vue.$http.put(`v1/service/playlist-republik/cart/item/${this.cartKey}`, data)
      } catch (err) {
        this.throwError(err)
      }
      this.$emit('next-step')
    },
    onPlaylistScroll: function (event) {
      let node = event.target
      if (node.scrollTop === (node.scrollHeight - node.offsetHeight)) {
        this.fetchPlaylists()
      }
    },
  },
}
</script>

<style lang="scss" scoped>

.top-filter-bar {
  background: white;
  padding-bottom: 0px;
  padding-top: 0px;
}

.top {
  display: flex;
  justify-content: space-between;
}

#playlist-wrap {
  max-height: 500px;
  overflow-y: scroll;
  overflow-x: hidden;
}

#playlist-wrap::-webkit-scrollbar {
  width: 11px;
  scrollbar-width: thin;
  scrollbar-color: rgb(220, 209, 223) #eae5eb;
}

#playlist-wrap::-webkit-scrollbar-track {
  background: #eae5eb;
}

#playlist-wrap::-webkit-scrollbar-thumb {
  background-color: rgb(220, 209, 223);
  border-radius: 6px;
  border: 3px solid rgb(220, 209, 223);
}

.playlist-select-text {
  font-size: 0.9rem;
  color: red;
}
</style>
