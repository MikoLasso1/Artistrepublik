<template>
  <v-row class="miniprofile-featuredmedia">
    <v-col cols="12" v-if="processing">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-col>
    <v-col cols="12" v-else-if="showDefaultDataImage">
      <LiveViewDefaultImage :image-src="defaultImage" />
    </v-col>
    <v-col cols="12" v-else-if="featuredMedia.url !== null && !processing">
      <blockquote
        class="embedly-card"
        :data-card-key="embedlyAppKey"
        data-card-controls="0"
        data-card-branding="0"
      >
        <h4><a :href="featuredMedia.url"></a></h4>
      </blockquote>
    </v-col>
  </v-row>
</template>
<script>
import Vue from 'vue'
import config from '@/config'
import LiveViewDefaultImage from '@/components/MiniProfile/Features/LiveViewDefaultImage'

export default {
  name: 'FeaturedMedia',
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
      featuredMedia: {
        url: null
      },
      username: this.userName ? this.userName : this.$route.params.username,
      processing: false,
      embedlyAppKey: config.EMBEDLY_APP_KEY,
      showDefaultDataImage: false,
      defaultImage: '/img/mini-profile/component-previews/CreateFeaturedMedia.png'
    }
  },
  methods: {
    async getData () {
      this.processing = true
      this.showDefaultDataImage = false
      try {
        //fetch data for FeaturedMedia
        let featuredMediaRes = await Vue.$http.get(
          `v1/user/mini-profile/media-embeds/featured`,
          {
            params: {
              layout_id: this.layoutId,
              username: this.username,
              type: 'media'
            }
          }
        )
        if (featuredMediaRes.status === 200 && featuredMediaRes.data.data) {
          this.featuredMedia = featuredMediaRes.data.data
        } else if (this.liveView === true) {
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
    this.$root.$on('updateLiveFeaturedMedia', () => {
      this.getData()
    })
  }
}
</script>
