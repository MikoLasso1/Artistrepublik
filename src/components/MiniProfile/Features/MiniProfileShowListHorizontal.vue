<template>
  <div>
    <LiveViewDefaultImage v-if="showDefaultDataImage" :image-src="defaultImage" />
    <h3 class="mt-2 text-center mb-5" :class="{'showlist-heading': dark}" v-if="shows.length">{{ title }}</h3>
    <v-row v-if="shows.length">
      <v-col md="6" class="mb-5" v-for="(item, index) in shows" :key="index">
        <v-card class="mx-auto">
          <v-img :src="item.image" max-width="100%" height="160px" alt="show image" loading="lazy"></v-img>
          <v-card-text class="text-center">
            <h3 class="card-title mb-2">{{ item.location }}</h3>
            <h4 class="card-subtitle mb-1 mt-1 text-muted">
              <v-icon>mdi-calendar-month-outline</v-icon>
              {{ item.date | formatDate }}
            </h4>
            <h4 class="card-subtitle mt-1 mb-1 text-muted">
              <v-icon>mdi-clock-time-ten-outline</v-icon>
              {{ item.time | formatTimeTo12Hrs }}
            </h4>
          </v-card-text>
        </v-card>
      </v-col>
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
    title: {
      default: 'Upcoming Shows',
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
      shows: [],
      username: this.userName ? this.userName : this.$route.params.username,
      showDefaultDataImage: false,
      defaultImage: '/img/mini-profile/component-previews/MiniProfileAllShows.png'
    }
  },
  methods: {
    async getShows () {
      this.showDefaultDataImage = false
      try {
        let response = await Vue.$http.get(`v1/user/mini-profile/show`, {
          params: {
            username: this.username
          }
        })
        this.shows = response.data.data
        if (this.shows.length === 0 && this.liveView === true) {
          this.showDefaultDataImage = true
        }
      } catch (error) {
        this.$sentry.captureException(error)
      }
    }
  },
  mounted () {
    this.getShows()
    this.$root.$on('updateLiveShows', () => {
      this.getShows()
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

.icon-size {
  font-size: 16px;
}

.showlist-heading {
  color: white;
}
</style>
