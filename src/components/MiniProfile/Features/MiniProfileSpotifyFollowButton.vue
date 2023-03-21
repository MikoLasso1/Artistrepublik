<template>
  <div>
    <LiveViewDefaultImage v-if="spotifyArtistId === null && liveView === true" :image-src="defaultImage" />
    <v-row v-else-if="spotifyArtistId">
      <v-spacer></v-spacer>
      <v-col md="auto" sm="12" class="text-right my-2">
        <iframe
          :src="
            `https://open.spotify.com/follow/1/?uri=spotify:artist:${spotifyArtistId}&size=detail&theme=light`
          "
          width="200"
          height="56"
          title="follow spotify artist"
          class="miniprofile-spotify-iframe"
        ></iframe>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LiveViewDefaultImage from '@/components/MiniProfile/Features/LiveViewDefaultImage'

export default {
  props: {
    spotifyArtistId: {
      default: null,
      type: [String, Number]
    },
    liveView: {
      default: false,
      type: Boolean
    }
  },
  components: {
    LiveViewDefaultImage
  },
  data () {
    return {
      defaultImage: '/img/mini-profile/component-previews/MiniProfileSpotifyFollowButtonView.png'
    }
  }
}
</script>
<style>
.miniprofile-spotify-iframe {
  width: max-content;
  margin: 0 auto;
  border: none;
  overflow: hidden;
}
</style>
