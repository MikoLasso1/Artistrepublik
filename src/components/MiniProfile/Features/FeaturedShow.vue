<template>
  <v-row class="my-2">
    <v-col cols="12" class="item text-center">
      <LiveViewDefaultImage v-if="showDefaultDataImage" :image-src="defaultImage" />
      <v-card class="mx-auto mb-3" v-else-if="showDetails">
        <v-img :src="featuredShow.image" max-width="100%" height="220px"></v-img>
        <v-card-text>
          <h3 class="card-title mb-2">{{ featuredShow.location }}</h3>
          <h4 class="card-subtitle mb-1 mt-1 text-muted">
            <v-icon>mdi-calendar-month-outline</v-icon>
            {{ featuredShow.date | formatDate }}
          </h4>
          <h4 class="card-subtitle mt-1 mb-1 text-muted">
            <v-icon>mdi-clock-time-ten-outline</v-icon>
            {{ featuredShow.time | formatTimeTo12Hrs }}
          </h4>
          <h4 class="card-subtitle mb-0 mt-0 text-muted">
            <a :href="featuredShow.ticket_url" target="_blank" rel="noopener" class="button-primary">
              <v-btn color="primary" class="mt-2 mb-2">Tickets</v-btn>
            </a>
          </h4>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import Vue from 'vue'
import LiveViewDefaultImage from '@/components/MiniProfile/Features/LiveViewDefaultImage'

export default {
  name: 'FeaturedShow',
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
      featuredShow: [],
      username: this.userName ? this.userName : this.$route.params.username,
      processing: false,
      showDetails: false,
      showDefaultDataImage: false,
      defaultImage: '/img/mini-profile/component-previews/MiniProfileFeaturedShowCreate.png'
    }
  },
  methods: {
    async getData () {
      this.processing = true
      this.showDefaultDataImage = false
      try {
        let featuredShowRes = await Vue.$http.get(`v1/user/mini-profile/show-featured`, {
          params: {
            username: this.username
          }
        })
        if (featuredShowRes.status === 200) {
          this.featuredShow = featuredShowRes.data.data
          this.showDetails = true
        } else if (this.liveView) {
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
    this.$root.$on('updateLiveFeaturedShow', () => {
      this.getData()
    })
  }
}
</script>
