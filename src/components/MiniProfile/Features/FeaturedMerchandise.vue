<template>
  <v-row class="my-2">
    <v-col cols="12" class="item text-center">
      <LiveViewDefaultImage v-if="showDefaultDataImage" :image-src="defaultImage" />
      <v-card class="mx-auto mb-3" v-else-if="showDetails">
        <v-img :src="featuredMerch.image" max-width="100%" height="220px"></v-img>
        <v-card-text>
          <h3 class="card-title mb-0">{{ featuredMerch.title }}</h3>
          <h4 class="card-subtitle mb-0 mt-0 text-muted">
            <a :href="featuredMerch.link" target="_blank" rel="noopener" class="button-primary">
              <v-btn color="primary" class="mt-2 mb-2">Buy Now</v-btn>
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
  name: 'FeaturedMerchandise',
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
      featuredMerch: {
        image: null,
        link: null,
        title: null
      },
      username: this.userName ? this.userName : this.$route.params.username,
      processing: false,
      showDetails: false,
      showDefaultDataImage: false,
      defaultImage: '/img/mini-profile/component-previews/MiniProfileFeaturedMerchandiseCreate.png'
    }
  },
  methods: {
    async getData () {
      this.processing = true
      this.showDefaultDataImage = false
      try {
        let featuredMerchRes = await Vue.$http.get(`v1/user/mini-profile/merchandise-feature`, {
          params: {
            username: this.username
          }
        })
        if (featuredMerchRes.status === 200) {
          this.featuredMerch = featuredMerchRes.data.data
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
    this.$root.$on('updateLiveFeaturedMerchandise', () => {
      this.getData()
    })
  }
}
</script>
