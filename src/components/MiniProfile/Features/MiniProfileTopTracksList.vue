<template>
  <div>
    <h3 class="mt-3 pb-3 text-center" v-if="items.length">Top Tracks</h3>
    <LiveViewDefaultImage v-if="showDefaultDataImage" :image-src="defaultImage" />
    <v-row class="top-tracks" v-else>
      <template v-for="(item, index) in items">
        <v-col cols="6" class="item text-center mb-2" :key="index" v-if="index < 6">
          <v-card class="mx-auto">
            <v-img :src="item.album_cover_photo" height="75px" alt="album image" loading="lazy"></v-img>
            <v-card-text>
              <a :href="item.external_track_link">{{ item.track_name }}</a>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue'
import LiveViewDefaultImage from '@/components/MiniProfile/Features/LiveViewDefaultImage'

export default {
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
      items: [],
      showDefaultDataImage: false,
      defaultImage: '/img/mini-profile/component-previews/MiniProfileTopTracksCreate.png'
    }
  },
  methods: {
    async getTopTracks () {
      this.processing = true
      this.showDefaultDataImage = false
      try {
        let response = await Vue.$http.get(`v1/user/${this.username}/tracks`)
        this.items = response.data
        if (this.items.length === 0 && this.liveView === true) {
          this.showDefaultDataImage = true
        }
      } catch (error) {
        this.$sentry.captureException(error)
      }
    }
  },
  mounted () {
    this.getTopTracks()
  },
  created () {
    this.getTopTracks()

  }
}
</script>

<style scoped>
.scrolling-wrapper-flexbox {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.scrolling-wrapper-flexbox .item {
  flex: 0 0 auto;
}

.card-img-top {
  height: 150px;
}
</style>
