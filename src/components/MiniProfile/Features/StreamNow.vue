<template>
  <div class="text-center">
    <v-progress-circular
      indeterminate
      color="primary"
      v-if="processing"
    ></v-progress-circular>
    <LiveViewDefaultImage v-if="showDefaultDataImage" :image-src="defaultImage" />
    <a :href="url" v-else-if="!processing && url">
      <v-btn dark color="black" class="my-3" width="100%">
        Stream Now&nbsp;&nbsp;
        <img src="/img/mini-profile/spotify.png" alt="spotify" width="25" height="25" />
      </v-btn>
    </a>
  </div>
</template>
<script>
import Vue from 'vue'
import config from '@/config'
import LiveViewDefaultImage from '@/components/MiniProfile/Features/LiveViewDefaultImage'

export default {
  name: 'StreamNow',
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
      url: null,
      name: null,
      showDefaultDataImage: false,
      defaultImage: '/img/mini-profile/component-previews/CreateStreamNow.png'
    }
  },
  methods: {
    async getData () {
      this.processing = true
      this.showDefaultDataImage = false
      try {
        let response = await Vue.$http.get(
          `v1/user/mini-profile/media-embeds/featured`,
          {
            params: {
              layout_id: this.layoutId,
              username: this.username,
              type: 'stream'
            }
          }
        )

        if (response.status === 200) {
          if (response.data.hasOwnProperty('data')) {
            let resData = response.data.data
            this.url = resData.url
            this.name = resData.network
          }
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
    this.$root.$on('updateLiveStreamNow', () => {
      this.getData()
    })
  }
}
</script>
