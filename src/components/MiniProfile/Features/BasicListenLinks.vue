<template>
  <div>
    <LiveViewDefaultImage v-if="showDefaultDataImage" :image-src="defaultImage" />
    <div v-else-if="links">
      <v-row
        v-for="(link, index) in links"
        :key="index"
        class="app-parent bg-default mb-4"
        align="center"
      >
        <v-col xs="2" class="pa-0 pa-sm-3">
          <v-avatar class="rounded-circle">
            <img
              :src="`/img/mini-profile/${link.app_name}.png`"
              :alt="link.app_name"
              loading="lazy"
            />
          </v-avatar>
        </v-col>
        <v-col xs="7" class="white--text">
          Listen now on
          <span class="text-capitalize">{{ link.app_title }}</span>
        </v-col>
        <v-col xs="3" class="text-left text-md-center">
          <a :href="link.value" target="_blank" rel="noopener">
            <v-btn class="btn-profile" dark>Listen</v-btn>
          </a>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import LiveViewDefaultImage from '@/components/MiniProfile/Features/LiveViewDefaultImage'

export default {
  name: 'BasicListenLinks',
  components: {
    LiveViewDefaultImage
  },
  props: {
    planId: {
      default: null,
      type: [String, Number]
    },
    userName: {
      default: null,
      type: String
    },
    layoutId: {
      default: null,
      type: [Number, String]
    },
    liveView: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      username: this.userName ? this.userName : this.$route.params.username,
      links: [],
      showDefaultDataImage: false,
      defaultImage: '/img/mini-profile/MiniProfileUpdateLinksView.png'
    }
  },
  methods: {
    async getData () {
      this.processing = true
      this.showDefaultDataImage = false
      try {
        this.links = []
        //get mini profile links
        let profileLinkResponse = await Vue.$http.get(
          `v1/user/mini-profile/links`,
          {
            params: {
              username: this.username,
              layout_id: this.layoutId
            }
          }
        )
        let reslinks = profileLinkResponse.data.data

        //get link order
        let linkOrderResponse = await Vue.$http.get(`v1/user/mini-profile/links/order`, {
          params: {
            layout_id: this.layoutId,
            username: this.username
          }
        })
        let linkOrderData = linkOrderResponse.data.data
        if (linkOrderData.length) {
          linkOrderData.forEach(element => {
            let newArray = reslinks.filter(function (el) {
              return el.app_id === element.id
            })
            if (newArray.length) {
              let app_name = newArray[0].app_name
              let value = newArray[0].url
              let app_title = newArray[0].app_title
              this.links.push({
                app_name: app_name,
                value: value,
                app_title: app_title
              })
            }
          })
        } else {
          Object.entries(reslinks).forEach((val) => {
            let app_name = val.app_name
            let value = val.url
            let app_title = val.app_title
            this.links.push({
              app_name: app_name,
              value: value,
              app_title: app_title
            })
          })
        }

        if (this.links.length === 0 && this.liveView === true) {
          this.showDefaultDataImage = true
        }

      } catch (error) {
        this.throwError(error)
      }
      this.processing = false
    }
  },
  created () {
    this.getData()
    this.$root.$on('updateLiveMiniProfileLinks', () => {
      this.getData()
    })
  }
}
</script>
<style scoped>
.list {
  border-radius: 10px;
  color: #fff;
}

.highlight {
  background-color: #f8f9fa;
}
</style>
