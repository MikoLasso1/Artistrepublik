<template>
  <div>
    <LiveViewDefaultImage v-if="showDefaultDataImage" :image-src="defaultImage" />
    <v-row v-else class="miniprofile-applogos">
      <v-col class="text-center mt-2 miniprofile-app-links" xs="3" md="3" lg="2" cols="3" v-for="(app, index) in apps" :key="index">
        <a target="_blank" rel="noopener" :href="app.url">
          <v-avatar>
            <v-img :src="`/img/mini-profile/${app.app_name}.png`" :alt="app.app_name" />
          </v-avatar>
        </a>
      </v-col>
      <v-col class="text-center mt-2 miniprofile-app-links" xs="3" md="3" lg="2" cols="3" v-for="(app, index) in customLinks" :key="`customLink${index}`">
        <a target="_blank" rel="noopener" :href="app.link">
          <v-avatar>
            <img :src="`/img/mini-profile/music-custom.png`" :alt="app.title" :title="app.title" loading="lazy" />
          </v-avatar>
        </a>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import Vue from 'vue'
import LiveViewDefaultImage from '@/components/MiniProfile/Features/LiveViewDefaultImage'

export default {
  name: 'AppLogos',
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
      username: this.userName ? this.userName : this.$route.params.username,
      apps: [],
      customLinks: {},
      defaultImage: '/img/mini-profile/MiniProfileAppLogos.png',
      showDefaultDataImage: false
    }
  },
  methods: {
    async getLinks () {
      this.apps = []
      this.showDefaultDataImage = false
      try {
        let profileLinkResponse = await Vue.$http.get(`v1/user/mini-profile/links`, {
          params: {
            username: this.username,
            layout_id: this.layoutId
          }
        })
        let links = profileLinkResponse.data.data
        let customLinkResponse = await Vue.$http.get(
          `v1/user/mini-profile/links/custom`,
          {
            params: {
              username: this.username,
              layout_id: this.layoutId
            }
          }
        )
        this.customLinks = customLinkResponse.data.data
        let linkOrderResponse = await Vue.$http.get(`v1/user/mini-profile/links/order`, {
          params: {
            layout_id: this.layoutId,
            username: this.username
          }
        })
        let linkOrderData = linkOrderResponse.data.data
        if (linkOrderData.length) {
          linkOrderData.forEach(element => {
            let newArray = links.filter(function (el) {
              return el.app_id === element.id
            })
            if (newArray.length) {
              this.apps.push(newArray[0])
            }
          })
        } else {
          this.apps = links
        }

        if (this.apps.length === 0 && this.liveView === true) {
          this.showDefaultDataImage = true
        }
      } catch (error) {
        this.$noty.warning('Error Occurred while processing request.')
      }
    }
  },
  created () {
    this.getLinks()
    this.$root.$on('updateLiveMiniProfileLinks', () => {
      this.getLinks()
    })
    this.$root.$on('updateLiveMiniProfileCustomLinks', () => {
      this.getLinks()
    })
  }
}
</script>
<style scoped>
img.app {
  max-width: 60px;
}

.miniprofile-app-links {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-content: center;
}
</style>
