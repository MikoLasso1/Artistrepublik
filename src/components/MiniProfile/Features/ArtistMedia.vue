<template>
  <v-row class="miniprofile-artistmedia my-2">
    <v-col cols="12" v-if="processing">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-col>
    <v-col cols="12" v-if="showDefaultDataImage">
      <LiveViewDefaultImage :image-src="defaultImage" />
    </v-col>
    <v-col
      cols="6"
      v-for="(media, index) in artistMedia"
      :key="index"
      v-else-if="artistMedia.length > 0 && !processing"
    >
      <blockquote
        class="embedly-card"
        :data-card-key="embedlyAppKey"
        data-card-controls="0"
        data-card-branding="0"
      >
        <h4><a :href="media.url"></a></h4>
      </blockquote>
    </v-col>
  </v-row>
</template>
<script>
import Vue from 'vue'
import config from '@/config'
import LiveViewDefaultImage from '@/components/MiniProfile/Features/LiveViewDefaultImage'

export default {
  name: 'ArtistMedia',
  components: {
    LiveViewDefaultImage
  },
  props: {
    layoutId: {
      default: null,
      type: [String, Number]
    },
    userName: {
      default: null,
      type: String
    },
    liveView: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      embedlyAppKey: config.EMBEDLY_APP_KEY,
      username: this.userName ? this.userName : this.$route.params.username,
      processing: false,
      artistMedia: [],
      showDefaultDataImage: false,
      defaultImage: '/img/mini-profile/component-previews/CreateArtistMedia.png'
    }
  },
  methods: {
    async getData () {
      this.processing = true
      this.showDefaultDataImage = false
      try {
        let artistMediaRes = await Vue.$http.get(
          `v1/user/mini-profile/media-embeds/`,
          {
            params: {
              layout_id: this.layoutId,
              username: this.username,
              type: 'media'
            }
          }
        )

        if (artistMediaRes.status === 200) {
          if (artistMediaRes.data.hasOwnProperty('data')) {
            this.artistMedia = artistMediaRes.data.data
          }
        }

        if (this.artistMedia.length === 0 && this.liveView === true) {
          this.showDefaultDataImage = true
        }
      } catch (error) {
        this.$sentry.captureException(error)
      }
      this.processing = false
    }
  },
  mounted () {
    this.getData()
    this.$root.$on('updateLiveArtistMedia', () => {
      this.getData()
    })
  }
}
</script>
<style>
.miniprofile-artistmedia iframe {
  max-height: 200px;
}
</style>
