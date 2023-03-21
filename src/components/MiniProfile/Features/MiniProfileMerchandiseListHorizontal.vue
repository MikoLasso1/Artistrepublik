<template>
  <div>
    <LiveViewDefaultImage v-if="showDefaultDataImage" :image-src="defaultImage" />
    <div v-else-if="merchandise !== null && merchandise.length">
      <h3 class="mt-2 text-center mb-5" :class="{'merchlist-heading': dark}">{{ title }}</h3>
      <v-row>
        <v-col md="6" v-for="(item, index) in merchandise" :key="index">
          <v-card class="mx-auto mb-3">
            <v-img :src="item.image" max-width="100%" height="160px" alt="item image" loading="lazy"></v-img>
            <v-card-text class="text-center">
              <h3 class="card-title mb-0">{{ item.title }}</h3>
              <h4 class="card-subtitle mb-0 mt-0 text-muted">
                <a :href="item.link" target="_blank" class="button-primary">
                  <v-btn color="primary" class="mt-2 mb-2">Buy Now</v-btn>
                </a>
              </h4>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import LiveViewDefaultImage from '@/components/MiniProfile/Features/LiveViewDefaultImage'

export default {
  name: 'MiniProfileMerchandiseListHorizontal',
  components: {
    LiveViewDefaultImage
  },
  props: {
    title: {
      default: 'Merchandise',
      type: String
    },
    dark: {
      default: false,
      type: Boolean
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
      merchandise: [],
      username: this.userName ? this.userName : this.$route.params.username,
      showDefaultDataImage: false,
      defaultImage: '/img/mini-profile/component-previews/MiniProfileMerchandiseList.png'
    }
  },
  methods: {
    async getMerchandise () {
      this.showDefaultDataImage = false
      try {
        let response = await Vue.$http.get(`v1/user/mini-profile/merchandise`, {
          params: {
            username: this.username
          }
        })
        this.merchandise = response.data.data
        if (this.merchandise.length === 0 && this.liveView) {
          this.showDefaultDataImage = true
        }
      } catch (error) {
        this.$sentry.captureException(error)
      }
    }
  },
  mounted () {
    this.getMerchandise()
    this.$root.$on('updateLiveMerch', () => {
      this.getMerchandise()
    })
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

.merchlist-heading {
  color: white;
}
</style>
