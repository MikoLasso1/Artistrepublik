<template>
  <div>
    <LiveViewDefaultImage v-if="showDefaultDataImage" :image-src="defaultImage" />
    <v-card class="mx-auto" max-width="400" v-if="track !== null && track.length !== 0 && track.name !== null">
      <v-img class="white--text align-end" height="175px" :src="track.imageSrc">
        <v-card-title></v-card-title>
      </v-img>
      <v-card-text class="text--primary text-uppercase song-body text-center">
        <h3 class="mt-0 mb-0 text-secondary">{{ track.name }}</h3>
        <a :href="track.link" target="_blank" rel="noopener">
          <v-btn color="green" outlined rounded class="mt-4">Listen Now</v-btn>
        </a>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import Vue from 'vue'
import LiveViewDefaultImage from '@/components/MiniProfile/Features/LiveViewDefaultImage'

export default {
  name: 'FeaturedTrack',
  components: {
    LiveViewDefaultImage
  },
  props: {
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
      username: this.userName ? this.userName : this.$route.params.username,
      track: {
        name: null,
        link: null,
        imageSrc: null
      },
      showDefaultDataImage: false,
      defaultImage: '/img/mini-profile/component-previews/MiniProfileTrack.png'
    }
  },
  methods: {
    getTrack () {
      this.showDefaultDataImage = false
      Vue.$http.get(`v1/user/mini-profile/track`, {
        params: {
          username: this.username
        }
      })
        .then(response => {
          let res = response.data.data
          if (response.status === 200) {
            this.track.name = res.song_name
            this.track.link = res.song_link
            this.track.imageSrc = res.song_image
          } else if (this.liveView === true) {
            this.showDefaultDataImage = true
          }
        })
        .catch(error => {
          this.$sentry.captureException(error)
        })
    }
  },
  created () {
    this.getTrack()
    this.$root.$on('updateLiveFeaturedTrack', () => {
      this.getTrack()
    })
  }
}
</script>
<style scoped>
.song-body {
  background: #242a38;
}
</style>
