<template>
  <div>
    <v-row>
      <v-col md="6" class="pt-2 pb-2">
        <playlists-filters @filtered="onFiltered" :track="track" />
      </v-col>
      <v-col md="6" class="text-right pt-2 pb-2">
        <cart @checkout="doCheckout" />
      </v-col>
    </v-row>

    <v-row>
      <v-col md="12">
        <h3 class="playlist-select-text mt-4 mb-3">
          * Add a couple more playlists with high placement percentages to
          increase your chances of getting playlisted!
        </h3>
        <v-row>
          <v-col class="text-right mb-8 mt-5">
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
                  Checkout
                </v-btn>
              </v-col>
            </v-row>


          </v-col>
        </v-row>
        <div id="playlist-wrap" ref="playlists">
          <playlist
            v-for="playlist in playlists"
            :key="playlist.id"
            :playlist="playlist"
            @toggle-selected="toggleSelectedPlaylists"
          />
        </div>
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
    Playlist
  },
  props: {
    track: Object,
    addCartItem: {
      default: true,
      type: Boolean
    }
  },
  data: function () {
    return {
      filters: '',
      playlists: [],
      selectedIds: [],
      currentPage: 0,
      lastPage: 1,
      fetching: false
    }
  },
  computed: {
    ...mapGetters({
      cartPlaylists: 'getCuratorOrderCart'
    })
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
      let ids = []
      for (const cartPlaylist of this.cartPlaylists) {
        ids.push(cartPlaylist.id)
      }
      Vue.$http
        .get(
          `v1/service/playlist-republik/curator/playlist/playlists?page=${this.currentPage}&for_upsell=1&min_placement_rate=80&genres=${this.track.genre_id}${
            this.filters ? '&' + this.filters : ''
          }`,
          {
            params: {
              exclude_playlist_ids: ids,
              exclude_user_playlists: true
            }
          }
        )
        .then(response => {
          this.playlists = this.playlists.concat(response.data.data)
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

      if (selectedIds.length) {
        let data = { type: 'curator', items: selectedIds }
        try {
          let cartKey = this.track.key
          if (this.addCartItem) {
            await Vue.$http.put(`v1/service/playlist-republik/cart/item/${cartKey}`, data)
          }
          this.$emit('next-step', cartKey)
        } catch (err) {
          this.throwError(err)
        }
      }
    },
    onPlaylistScroll: function (event) {
      let node = event.target
      if (node.scrollTop === node.scrollHeight - node.offsetHeight) {
        this.fetchPlaylists()
      }
    }
  },
  watch: {
    filters: function () {
      this.currentPage = 0
      this.fetchPlaylists(true)
    }
  },
  created: function () {
    this.fetchPlaylists()
    this.$store.dispatch('updateIntentStep', 'select playlists')
  },
  mounted: function () {
    this.$refs.playlists.addEventListener('scroll', this.onPlaylistScroll)
  }
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
  max-height: 700px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.playlist-select-text {
  color: red;
}
</style>
