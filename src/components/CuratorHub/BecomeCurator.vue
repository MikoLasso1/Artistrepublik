<template>
  <div>
    <card
      v-if="fromCuratorDash === 0"
      header-classes="bg-transparent p-0"
    >
      <div class="p-0 text-center">
        <div class="col verification-icon">
          <picture>
            <source srcset="/img/curator/curator_sm.webp" type="image/webp">
            <img src="/img/curator/curator_sm.png" alt="disc in sleeve" loading="lazy" />
          </picture>
          <h2 class="text-uppercase text-muted ls-1 mb-1 h6">
            Curator Hub
          </h2>
          <h3 class="h3 mb-0 verification-title">
            Become a Curator
          </h3>
          <h4>Make money by offering artists a chance to be on your playlists.</h4>
          <h5 class=" h6 text-uppercase text-muted ls-1 mb-1">
            apply to be a curator today
          </h5>
        </div>
        <v-btn
          dark
          color="primary"
          @click="showApplyCuratorModal"
          :loading="isSpotifyConnected"
        >
          <span v-if="playlist_count > 0">Change Playlists</span><span v-else>Start</span>
        </v-btn>
      </div>
    </card>
    <div v-else>
      <v-btn
        dark
        color="primary"
        @click="showApplyCuratorModal"
      >
        <span v-if="playlist_count < 0">Change Playlists</span><span v-else>Add Playlists</span>
      </v-btn>
    </div>
    <apply-curator-modal ref="applyCuratorModal" />
  </div>
</template>

<script>
import ApplyCuratorModal from '@/components/CuratorHub/ApplyCuratorModal'
import Vue from 'vue'

export default {

  components: {
    ApplyCuratorModal
  },
  props: {
    fromCuratorDash: Number
  },
  data: function () {
    return {
      step: 1,
      track: null,
      playlist_count: 0,
      isSpotifyConnected: false
    }
  },
  created: async function () {
    if (this.$route.query.code && window.localStorage.getItem('code_type') === 'spotify') {
      try {
        this.isSpotifyConnected = true
        await Vue.$http.post('v1/spotify/access', { code: this.$route.query.code })
        this.isSpotifyConnected = false
      } catch (err) {
        console.error(err)
      }
      window.localStorage.removeItem('code_type')
    }

    this.$store.dispatch('checkSpotifyAccessStatus')
    //TODO show loading until this is done
    Vue.$http.get('v1/service/playlist-republik/curator/is-curator')
      .then(response => {
        if (response.data.data.is_curator) {
          this.playlist_count = response.data.data.playlist_count
        }
      })
      .catch(err => this.$sentry.captureException(err))
  },
  methods: {
    showApplyCuratorModal: function () {
      this.$refs.applyCuratorModal.openCuratorModal()
    }
  }
}
</script>

<style>

</style>
